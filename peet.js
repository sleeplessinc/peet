
PEET = {}

PEET.set_status = function(node) {

	if(node.deleted) { 
		return;		// ignore node if it's deleted
	}

	node._reds = [];		// temp var, deleted before returning
	node.opposed = 0;
	node.status = "Unopposed";

	// count how many undeleted child nodes are in current node
	var len = 0;
	for(var k in node.oppose) {
		if(!node.oppose[k].deleted) {
			len += 1;
		}
	}

	if(len == 0) {
		// leaf node; oppose up the tree, skipping every other parent after immediate parent
		var mom = node._mom;
		while(mom) {
			mom._reds.push(node.path);
			if(!mom._mom || !mom._mom._mom) {
				break;
			}
			mom = mom._mom._mom;
		}
	}
	else {
		// not a leaf
		// walk through child nodes and recurse on each one
		for(var k in node.oppose) {
			var n = node.oppose[k];
			if(n.deleted) { 
				continue;		// ignore deleted nodes
			}
			n._mom = node;		// temp var; deleted after recurse call
			var o = PEET.set_status(n, node);	// recurse
			delete n._mom;
		}
	}

	if(node._reds.length > 0) {
		node.status = "Opposed by "+node._reds.join(", ");
		node.opposed = 1;
	}

	delete node._reds;
}


if((typeof process) === 'undefined') {
	// browser (client)
}
else {
	// node (server)
	module.exports = PEET;
}




