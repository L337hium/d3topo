d3.tsv("current-topo.tsv", function(d) {
	width = document.getElementById("graph").offsetWidth;
	height = 1000;

	var force = d3.layout.force()
			.charge(-120)
			.linkDistance(50) /* 75 25 */
			.size([width, height]);

	var svg = d3.select("#graph").append("svg")
			.attr("width", width)
			.attr("height", height);
           
	var linkNodes = [];

	ips = _.reduce(_.map(d, function(d) { return ( [d.dest,d.src] )} ), function(x,y) { return (x.concat(y)) }, [] )
  
	degree = _.reduce(ips, function(x,y) { if (x[y]==undefined) { x[y]=1; } else { x[y]+=1; } return (x)}, {})
  
	ips = _.uniq(ips)
	ip_lookup = _.reduce(_.map(ips,function(d,n) { return ([d,n])}), function(x,y) {x[y[0]]=y[1]; return(x)},{});
  
	radius = function(degree) {
		max = _.max(_.values(degree));
		min = 2;  // 1
		max_rad = 20;  // 10
		min_rad = 6;  // 3
		return function(n) { return (((n-min)/(max-min)*(max_rad-min_rad)+min_rad)) }
	}(degree);

	function cost(x) { 
		var c = 1/x*5; 
		if (isNaN(c)) { return 0.2; }
		else { return (c); }
	}
  
	var graph={
		"nodes": _.map(ips, function(d) { return ({ "name": d, "degree": degree[d] }) }),
		"links": _.map(d, function(d) {
			return ({
				"source": ip_lookup[d.dest],
				"target": ip_lookup[d.src],
				"value": cost(d.cost)
			})
		})
	}

	graph.links.forEach(function(link) {
		linkNodes.push({
			source: graph.nodes[link.source],
			target: graph.nodes[link.target]
		});
	});

	force
		.nodes(graph.nodes.concat(linkNodes))
		.links(graph.links)
		.start();

	var link = svg.selectAll(".link")
			.data(graph.links)
			.enter()
			.append("line")
			.attr("class", "link")
			.style("stroke-width", function(d) { return Math.sqrt(d.value); });


	var node = svg.selectAll(".node")
			.data(graph.nodes)
			.enter()
			.append("g")
			.call(force.drag);

		node.append("circle")
			.attr("class", "node")
			.attr("r", function(d) { return (radius(d.degree)) })
			.attr("name", function(d) { return (d.name) });

		/*node.on('mouseover', function(d) {
			d3.select(this).style({ fill: 'red' });
		});
		node.on('mouseout', function(d) {
			d3.select(this).style({ fill: '#ccc' });
		});*/

		/*node.append("title")
			.text(function(d) { return d.name; });*/

		node.append("svg:a")
			.attr("dx", 24)
			.attr("dy", 24 /*".35em"*/)
			.style("font-size", "10px")
			.attr("xlink:href", function(d) { return "http://"+d.name; })
			.append("svg:text").text(function(d) { return d.name; });

/*		node.append("text")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.style("font-size", "10px")
			.text(function(d) { return d.name });
*/		 

	var linkNode = svg.selectAll(".link-node")
			.data(linkNodes)
			.enter()
			.append("circle")
			.attr("class", "link-node")
			.attr("r", 2)
			.style("fill", "#ccc");

	force.on("tick", function() {
		link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });
		node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; })
			.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
		linkNode.attr("cx", function(d) { return d.x = (d.source.x + d.target.x) * 0.5; })
			.attr("cy", function(d) { return d.y = (d.source.y + d.target.y) * 0.5; });
	});
});
