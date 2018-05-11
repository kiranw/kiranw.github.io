// number of random nodes (gets crowded at >25 unless you change node diameter)
var num = 50;

// returns random int between 0 and num
function getRandomInt() {return Math.floor(Math.random() * (num));}

// nodes returns a [list] of {id: 1, fixed:true}
var nodes = d3.range(num).map(function(d) { return {id: d} });

// links returns a [list] of {source: 0, target: 1} (values refer to indicies of nodes)
var links = d3.range(num).map(function(d) { return {source: getRandomInt(), target: getRandomInt()}; });

var width = 800,
    height = 800;

var force = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links));

// evenly spaces nodes along arc
var circleCoord = function(node, index, num_nodes){
    var circumference = circle.node().getTotalLength();
    var pointAtLength = function(l){return circle.node().getPointAtLength(l)};
    var sectionLength = (circumference)/num_nodes;
    var position = sectionLength*index+sectionLength/2;
    return pointAtLength(circumference-position)
}

// fades out lines that aren't connected to node d
var is_connected = function(d, opacity) {
    lines.transition().style("stroke-opacity", function(o) {
        return o.source === d || o.target === d ? 1 : opacity;
    });
}

var svg = d3.select("#svg").append("svg")
    .attr("width", width)
    .attr("height", height);


// invisible circle for placing nodes
// it's actually two arcs so we can use the getPointAtLength() and getTotalLength() methods
var dim = width-80
var circle = svg.append("path")
    .attr("d", "M 40, "+(dim/2+40)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
    .style("fill", "#f5f5f5");

force.restart();

// set coordinates for container nodes
nodes.forEach(function(n, i) {
    var coord = circleCoord(n, i, nodes.length);
    n.x = coord.x;
    n.y = coord.y;
});

// use this one for straight line links...
var lines = svg.selectAll("line.node-link")
  .data(links).enter().append("line")
    .attr("class", "node-link")
  .attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

// ...or use this one for curved line links
// var lines = svg.selectAll("path.node-link")
//     .data(links).enter().append("path")
//     .attr("class", "node-link")
//     .attr("d", function(d) {
//         var dx = d.target.x - d.source.x,
//             dy = d.target.y - d.source.y,
//             dr = Math.sqrt(dx * dx + dy * dy);
//         return "M" +
//             d.source.x + "," +
//             d.source.y + "A" +
//             dr + "," + dr + " 0 0,1 " +
//             d.target.x + "," +
//             d.target.y;
//     });

var gnodes = svg.selectAll('g.gnode')
    .data(nodes).enter().append('g')
    .attr("transform", function(d) {
        return "translate("+d.x+","+d.y+")"
    })
    .classed('gnode', true);

var node = gnodes.append("circle")
    .attr("r", 15)
    .attr("class", "node")
    .on("mouseenter", function(d) {
        is_connected(d, 0.1)
        node.transition().duration(100).attr("r", 15)
        d3.select(this).transition().duration(100).attr("r", 30)
    })
    .on("mouseleave", function(d) {
        node.transition().duration(100).attr("r", 15);
        is_connected(d, 1);
    });

var labels = gnodes.append("text")
        .attr("dy", 4)
        .attr("class","label")
        .text(function(d){return d.id})