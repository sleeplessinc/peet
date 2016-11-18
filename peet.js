
PEET = {
}

PEET.set_status = function(node) {
	// recursively massage the node objects
	var recurse = function(nodes) {
		var rr = []
		for(var k in nodes) {
			var node = nodes[k];
			if(node.deleted != 0) {
				continue;		// skip
			}

			var oppose = node.oppose;
			var ops = recurse(oppose);
			if(ops.length == 0) {
				node.status = "Unopposed"
				node.opposed = 0;
				rr.push(node.path)
			}
			else {
				node.status = "Opposed: "+ops.join(", ")
				node.opposed = 1;
			}

			node.creation_info = "Created "+ts2us(node.created)+" by "+(node.creator || "Someone");
			node.modification_info = ""
			if(node.modified) {
				node.modification_info = "Modified "+ts2us(node.modified)+" by "+node.modifier
			}

			// abbreviated version of content str
			node.content_abbr = node.content; //.abbr(60);
		}
		return rr
	}

	recurse(node);
	return node;
}

PEET.set_refute_status = PEET.set_status;		// deprecated


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




