
var log = function(s) { console.log(s); };

PEET = {}


/*
PEET.nuke_deleted = function(nodes) {
	var recurse = function(nodes) {
		for(var k in nodes) {
			var node = nodes[k];
			if(node.deleted != 0) {
				delete nodes[k];
				log("nuked node "+k);
				continue;		// skip
			}
			recurse(node.oppose);
		}
	}
}
*/

PEET.set_status = function(node) {

	if(node.deleted) { 
		//log(" root note deleted (ignoring): "+node.path);
		return;
	}

	node._reds = [];
	node.opposed = 0;
	node.status = "Unopposed"


	var len = 0;
	for(var k in node.oppose) {
		if(!node.oppose[k].deleted) {
			len += 1;
		}
	}
	//log("node "+node.path+" has "+len+" undeleted sub-nodes");

	if(len == 0) {
		// a leaf ... oppose up the tree, skipping every other parent after immediate parent
		//log("  LEAF ");
		var mom = node._mom;
		while(mom) {
			mom._reds.push(node.path);
			//log("    red flag: "+mom.path);
			if(!mom._mom || !mom._mom._mom) {
				break;
			}
			mom = mom._mom._mom;
		}
	}
	else {
		// not a leaf ... recurse
		//log(" not a leaf "+node.path);
		for(var k in node.oppose) {
			var n = node.oppose[k];
			if(n.deleted) { 
				//log("   skipping deleted node: "+n.path);
				continue;
			}
			n._mom = node;
			var o = PEET.set_status(n, node);
			delete n._mom;
		}
	}

	if(node._reds.length > 0) {
		node.status = "Opposed by "+node._reds.join(", ");
		node.opposed = 1;
	}

	delete node._reds;

	//log("  node "+node.path+" is "+node.status);
}



if((typeof process) === 'undefined') {
	// browser (client)

}
else {
	// node (server)

	module.exports = PEET;

	if(require.main === module) {
		require('./test.js')
	}

}




