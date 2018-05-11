var districtID = "example"
var districtSvg = "districtExampleSvg"
var total_nodes = 10;

var local_nodes = d3.range(total_nodes);
var scores = local_nodes.reduce(function(map, obj) {
    map[obj] = 0;
    return map;
}, {});
var currentLeader = 0;

var nodes = d3.range(total_nodes).map(function(d) { return {id: d} });
var links_unflat = d3.range(total_nodes).map(function(d) {
    local_links = []
    d3.range(total_nodes).forEach(function(e){
        if (e!=d){
            local_links.push({source:d, target:e})
        }
    })
    return local_links;
});
var links = [];
links_unflat.forEach(function(l){
    l.forEach(function(m){
        links.push(m)
    })
})


var width = 500,
    height = 500;
var force = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links));

var exampleWriteQueue = []
var exampleReadQueue = []


// returns random int between 0 and num
function getRandomInt(num) {return Math.floor(Math.random() * (num));}



function timeStamp() {
    // Create a date object with the current time
    var now = new Date();
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = "0" + time[i];
        }
    }
    // Return the formatted string
    return date.join("/") + " " + time.join(":") + " " + suffix;
}


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
        return o.source === d || o.target === d ? 0.7 : opacity;
    });
}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


var svg = d3.select("#"+districtSvg).append("svg")
    .attr("width", width)
    .attr("height", height);

var dim = width-80
var circle = svg.append("path")
    .attr("d", "M 40, "+(dim/2+40)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
    .style("fill", "#f5f5f5");

var state = "none";

force.restart();

// set coordinates for container nodes
nodes.forEach(function(n, i) {
    var coord = circleCoord(n, i, nodes.length);
    n.x = coord.x;
    n.y = coord.y;
});

var lines = svg.selectAll("line.node-link")
    .data(links).enter().append("line")
    .attr("class", "node-link")
    .attr("opacity",0.7)
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

var gnodes = svg.selectAll('g.gnode')
    .data(nodes).enter().append('g')
    .attr("transform", function(d) {
        return "translate("+d.x+","+d.y+")"
    })
    .classed('gnode', true);

var node = gnodes.append("circle")
    .attr("r", 15)
    .attr("class", "node")
    .attr("id", function(d){ return districtID + d.id; })
    .on("mouseenter", function(d) {
        is_connected(d, 0.1)
        node.transition().duration(100).attr("r", 15)
        d3.select(this).transition().duration(100).attr("r", 30)
    })
    .on("mouseleave", function(d) {
        node.transition().duration(100).attr("r", 15);
        is_connected(d, 0.7);
    });

var labels = gnodes.append("text")
    .attr("dy", 4)
    .attr("class","label")
    .text(function(d){return d.id});

d3.select("#"+districtID + currentLeader)
    .attr("class","node leader");





function transitionLeader(node,i){
    if (i==0){
        newLeader = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b });
        appendToLog("new leader: node"+newLeader);

        appendToLog("transitioning leader")
        if (currentLeader != newLeader){
            d3.select("#"+districtID + currentLeader)
                .classed("leader", false);
            currentLeader = newLeader;
            d3.select("#"+districtID + currentLeader)
                .attr("class","node leader");
        }
    }
}


// every regular interval update scores
function updateScores(){
    // If currentLeader, multiply reward/deduction by 5
    // Else add or deduct random amount;
    // If leader's score is not the max, change color to red
    local_nodes.forEach(function(d){
        if (currentLeader == d){
            scores[d] += (getRandomInt(30) - 15);
        }
        else {
            scores[d] += (getRandomInt(30) - 15);
        }
    })
    $("#" + districtID + "Scores1").text(JSON.stringify(scores, null, 2));
}
setInterval(updateScores, 500);


// Initiate an election at a regular interval
// function runElection(){
    // broadcast election

    // Collect votes within a specific time limit
    // Choose random order of nodes

    // Choose random number of total votes
    // Each node submits a vote to the leader and backup
    // Once time limit expires, count votes

d3.select("#exampleRunElection").on("click", function() {
    appendToLog("initiating election");

    var nodes = d3.range(total_nodes).map(function(d) { return {id: d} });
    nodes.forEach(function(n, i) {
        var coord = circleCoord(n, i, nodes.length);
        n.x = coord.x;
        n.y = coord.y;
    });

    var broadcast_node = svg.append("g")
        .attr("class","broadcast")
        .selectAll(".bnode")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("opacity", 0)
        .attr("class", "bnode")
        .attr("cx",function(d){ return nodes[currentLeader].x;  })
        .attr("cy", function(d){ return nodes[currentLeader].y ; })
        .transition()
        .duration(function(){ return getRandomInt(800) + 5000; })
        .attr("opacity",1)
        .attr("cx", function(d){ return d.x;})
        .attr("cy", function(d){ return d.y})
        .on( "end", function(d,i) {
            appendToLog("broadcasting vote request",d,i,true);
        })
        .transition(0)
        .duration(function(){ return getRandomInt(800) + 200; })
        .attr("opacity",0)
        .on( "end", function(d,i) {
            appendToLog(i + " received request",d,i,false);
        })
        .transition()
        .duration(function(){ return getRandomInt(800) + 5000; })
        .delay( function(){ return getRandomInt(500); })
        .attr("opacity",1)
        .attr("cx", nodes[currentLeader].x)
        .attr("cy", nodes[currentLeader].y)
        .on( "end", function(d,i) {
            appendToLog(i + " voted",d,i,false);
        })
        .transition(100)
        .duration(1000)
        .attr("opacity",0)
        .transition()
        .duration(function(){ return getRandomInt(800) + 5000; })
        .delay( function(){ return getRandomInt(700); })
        .attr("opacity",1)
        .attr("cx", function(d){ return d.x;})
        .attr("cy", function(d){ return d.y})
        .on( "end", function(d,i) {
            appendToLog("voted processed",d,i,true);
        })
        .transition(100)
        .duration(1000)
        .attr("opacity",0)
        .on( "end", function(d,i) {
            transitionLeader(d,i);
        })
        .exit().remove();
    // New leader starts

});

// Run a write at some random interval
function callRead(){
    // Randomly choose a node to request to current leader
    // Send circle to leader
    // Leader either adds to their issue list or doesnt randomly
        appendToLog("initiating read request");

        var nodes = d3.range(total_nodes).map(function(d) { return {id: d} });
        nodes.forEach(function(n, i) {
            var coord = circleCoord(n, i, nodes.length);
            n.x = coord.x;
            n.y = coord.y;
        });

        selectedNode = nodes[getRandomInt(total_nodes)];

        var broadcast_node2 = svg.selectAll(".bnode3")
            .data([selectedNode])
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("fill", "black")
            .attr("opacity", 1)
            .attr("class", "bnode3")
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            .transition()
            .duration(function(){ return getRandomInt(800) + 2000; })
            .attr("opacity",1)
            .attr("cx", nodes[currentLeader].x)
            .attr("cy", nodes[currentLeader].y)
            .on( "start", function() {
                appendToLog("requesting read",selectedNode,0,false);
            })
            .transition()
            .duration(400)
            .attr("opacity", 0)
            .transition(500)
            .duration(function(){ return getRandomInt(800) + 2000; })
            .attr("opacity", 1)
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
            .on("start", function() {
                appendToLog("received read request",selectedNode,0,false);
                updateReadQueue(selectedNode.id,true);
            })
            .on("end", function() {
                appendToLog("read response issued",selectedNode,0,false);
                updateReadQueue(selectedNode.id,false);
            })
            .transition()
            .duration(400)
            .attr("opacity", 0).remove()
            .on("end", function() {
                appendToLog("read response received",selectedNode,0,false);
            });


}

function updateExampleWriteQueue(srcNode){
    exampleWriteQueue.push([srcNode, currentLeader]);
    $("#exampleWriteQueue").text(JSON.stringify(exampleWriteQueue));
}

function updateReadQueue(srcNode,add){
    if (add){
        exampleReadQueue.push([srcNode, currentLeader]);
        $("#exampleReadQueue").text(JSON.stringify(exampleReadQueue));
    }
    else {
        exampleReadQueue = [];
        $("#exampleReadQueue").text(JSON.stringify(exampleReadQueue));
    }
}

d3.select("#exampleWrite").on("click", function(){ callWrite();});
d3.select("#exampleRead").on("click", function(){ callRead();});

// Run a read on some random interval
function callWrite(){
    // Randomly choose a node to request
    // Send circle to the leader
    // Leader responds back
    appendToLog("initiating write request");

    var nodes = d3.range(total_nodes).map(function(d) { return {id: d} });
    nodes.forEach(function(n, i) {
        var coord = circleCoord(n, i, nodes.length);
        n.x = coord.x;
        n.y = coord.y;
    });

    selectedNode = nodes[getRandomInt(total_nodes)];
    console.log(selectedNode)
    console.log(currentLeader)

    var broadcast_node2 = svg.selectAll(".bnode2")
        .data([selectedNode])
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("opacity", 1)
        .attr("class", "bnode2")
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .transition()
        .duration(function(){ console.log("hi"); return getRandomInt(800) + 2000; })
        .attr("opacity",1)
        .attr("cx", nodes[currentLeader].x)
        .attr("cy", nodes[currentLeader].y)
        .on( "start", function() {
            appendToLog("requesting write",selectedNode,0,false);
        })
        .transition()
        .duration(400)
        .attr("opacity", 0)
        .transition(500)
        .duration(function(){ return getRandomInt(800) + 2000; })
        .attr("opacity", 1)
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .on("start", function() {
            appendToLog("received write request",selectedNode,0,false);
        })
        .on("end", function() {
            appendToLog("ack write request",selectedNode,0,false);
            updateExampleWriteQueue(selectedNode.id);
        })
        .transition()
        .duration(400)
        .attr("opacity", 0).remove();
}

function appendToLog(msg,node,index,flag){
    console.log($("#log-text").prop("scrollHeight"));
    if (flag){
        if (index==0){
            $("#log-text").append(timeStamp() + "<br><strong>" + msg+"</strong><br><br>")
            $("#log-text").scrollTop($("#log-text").prop("scrollHeight"));
        }
    }
    else {
        $("#log-text").append(timeStamp() + "<br><strong>" + msg+"</strong><br><br>")
        $("#log-text").scrollTop($("#log-text").prop("scrollHeight"));
    }
}