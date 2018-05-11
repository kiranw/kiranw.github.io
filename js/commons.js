
var c_total_nodes = 12;
var districtLeaders = {};

var districtWriteQueues = {};
var c_write_queue = [];

// returns random int between 0 and num
function getRandomInt(num) {return Math.floor(Math.random() * (num));}

d3.range(c_total_nodes).forEach(function(d){

    d_total_nodes = 10;
    var c_districtID = "district_"+d+"_";

    var commonsSvg = "commonsDistrict" + d;
    $("#" + commonsSvg).append("<br><div class='district-name'>DISTRICT " + d + "</div>");

    var c_local_nodes = d3.range(d_total_nodes);
    var c_currentLeader = getRandomInt(d_total_nodes);
    districtLeaders[d] = c_currentLeader;
    districtWriteQueues[d] = []

    d3.range(getRandomInt(5)+3).forEach(function(){
        districtWriteQueues[d].push(getRandomInt(10));
    });

    updateWriteQueue(d);

    var c_nodes = d3.range(d_total_nodes).map(function(d) { return {id: d} });
    var c_links_unflat = d3.range(d_total_nodes).map(function(d) {
        c_local_links = []
        d3.range(d_total_nodes).forEach(function(e){
            if (e!=d){
                c_local_links.push({source:d, target:e})
            }
        })
        return c_local_links;
    });
    var c_links = [];
    c_links_unflat.forEach(function(l){
        l.forEach(function(m){
            c_links.push(m)
        })
    })

    var c_width = 200,
        c_height = 200;
    var force = d3.forceSimulation(c_nodes)
        .force("link", d3.forceLink(c_links));

    var svg = d3.select("#"+commonsSvg).append("svg")
        .attr("width", c_width)
        .attr("height", c_height);

    var dim = 120;
    var d_circle = svg.append("path")
        .attr("d", "M 20, "+(dim/2+40)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
        .style("fill", "#f5f5f5");

    // evenly spaces nodes along arc
    var d_circleCoord = function(node, index, num_nodes){
        var circumference = d_circle.node().getTotalLength();
        var pointAtLength = function(l){return d_circle.node().getPointAtLength(l)};
        var sectionLength = (circumference)/num_nodes;
        var position = sectionLength*index+sectionLength/2;
        return pointAtLength(circumference-position)
    }

    force.restart();

    // set coordinates for container nodes
    c_nodes.forEach(function(n, i) {
        var coord = d_circleCoord(n, i, c_nodes.length);
        n.x = coord.x;
        n.y = coord.y;
    });

    var gnodes = svg.selectAll('g.gnode')
        .data(c_nodes).enter().append('g')
        .attr("transform", function(d) {
            return "translate("+d.x+","+d.y+")"
        })
        .classed('gnode', true);

    var node = gnodes.append("circle")
        .attr("r", 15)
        .attr("class", "node")
        .attr("id", function(d){ return c_districtID + d.id; })
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

    d3.select("#"+c_districtID + c_currentLeader)
        .attr("class","node leader")
        .attr("r",23);

});

var commonsID = "commons"
var commonsSvg = "commonsSvg";
var c_local_nodes = d3.range(c_total_nodes);
var c_scores = c_local_nodes.reduce(function(map, obj) {
    map[obj] = 0;
    return map;
}, {});
var c_currentLeader = 0;

var c_nodes = d3.range(c_total_nodes).map(function(d) { return {id: d} });
var c_links_unflat = d3.range(c_total_nodes).map(function(d) {
    c_local_links = []
    d3.range(c_total_nodes).forEach(function(e){
        if (e!=d){
            c_local_links.push({source:d, target:e})
        }
    })
    return c_local_links;
});
var c_links = [];
c_links_unflat.forEach(function(l){
    l.forEach(function(m){
        c_links.push(m)
    })
})

var c_width = 500,
    c_height = 500;
var c_force = d3.forceSimulation(c_nodes)
    .force("link", d3.forceLink(c_links));

var c_svg = d3.select("#"+commonsSvg).append("svg")
    .attr("width", c_width)
    .attr("height", c_height);

var dim = c_width-80;
var c_circle = c_svg.append("path")
    .attr("d", "M 40, "+(dim/2+40)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
    .style("fill", "#f5f5f5");

// evenly spaces nodes along arc
var c_circleCoord = function(node, index, num_nodes){
    // console.log(c_circle.node());
    var circumference = c_circle.node().getTotalLength();
    var pointAtLength = function(l){return c_circle.node().getPointAtLength(l)};
    var sectionLength = (circumference)/num_nodes;
    var position = sectionLength*index+sectionLength/2;
    return pointAtLength(circumference-position)
}

c_force.restart();

// set coordinates for container nodes
c_nodes.forEach(function(n, i) {
    var coord = c_circleCoord(n, i, c_nodes.length);
    n.x = coord.x;
    n.y = coord.y;
});

var c_lines = c_svg.selectAll("line.node-link")
    .data(c_links).enter().append("line")
    .attr("class", "node-link")
    .attr("opacity",0.7)
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

var c_gnodes = c_svg.selectAll('g.gnode')
    .data(c_nodes).enter().append('g')
    .attr("transform", function(d) {
        return "translate("+d.x+","+d.y+")"
    })
    .classed('gnode', true);


// fades out lines that aren't connected to node d
var c_is_connected = function(d, opacity) {
    c_lines.transition().style("stroke-opacity", function(o) {
        return o.source === d || o.target === d ? 0.7 : opacity;
    });
}

var c_node = c_gnodes.append("circle")
    .attr("r", 25)
    .attr("class", "node")
    .attr("id", function(d){ return commonsID + d.id; })
    .on("mouseenter", function(d) {
        c_is_connected(d, 0.1)
        c_node.transition().duration(100).attr("r", 25)
        d3.select(this).transition().duration(100).attr("r", 30)
    })
    .on("mouseleave", function(d) {
        c_node.transition().duration(100).attr("r", 25);
        is_connected(d, 0.7);
    });


var labels = c_gnodes.append("text")
    .attr("dy", 4)
    .attr("class","label2")
    .attr("id", function(d){ return "commonslabel" + d.id})
    .text(function(d){return d.id + "." + districtLeaders[d.id];});



d3.select("#"+ commonsID + c_currentLeader)
    .attr("class","node leader");
d3.select(".col_" + c_currentLeader)
    .classed("leading-district",true);




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

function setupParliament(){
    var e_nodes = d3.range(c_total_nodes).map(function(d) { return {id: d} });
    e_nodes.forEach(function(n, i) {
        var coord = c_circleCoord(n, i, e_nodes.length);
        n.x = coord.x;
        n.y = coord.y;
    });

    var broadcast_node = c_svg.append("g")
        .attr("class","broadcast")
        .selectAll(".bnode4")
        .data(e_nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("opacity", 0)
        .attr("class", "bnode4")
        .attr("cx",function(d){ return e_nodes[c_currentLeader].x;  })
        .attr("cy", function(d){ return e_nodes[c_currentLeader].y ; });
}


setupParliament();

function parliament(current_district){

    // Shuffle order
    // var shuffled_nodes = shuffle(d3.range(c_total_nodes));
    // For each district, empty write queue, send that many circles to leader, broadcast, vote, broadcast
    write_queue = districtWriteQueues[current_district];

    appendToCommonsLog("starting Parliament session");

    var e_nodes = d3.range(c_total_nodes).map(function(d) { return {id: d} });
    e_nodes.forEach(function(n, i) {
        var coord = c_circleCoord(n, i, e_nodes.length);
        n.x = coord.x;
        n.y = coord.y;
    });

    // console.log(broadcast_node)

    // var broadcast_node = c_svg.append("g")
    //     .attr("class","broadcast")
    //     .selectAll(".bnode4")
    //     .data(e_nodes)
    //     .enter()
    //     .append("circle")
    //     .attr("r", 5)
    //     .attr("fill", "black")
    //     .attr("opacity", 0)
    //     d3.selectAll(".bnode4")
    d3.selectAll(".bnode4")
        .transition()
        .duration(function(){ return getRandomInt(100) + 600; })
        .attr("opacity", function(d){
            return d.id == current_district ? 1 : 0;
        })
        .attr("cx", function(d){ return d.x;})
        .attr("cy", function(d){ return d.y})
        .on( "start", function(d,i) {
            appendToCommonsLog("requesting district " + current_district + " write requests",d,current_district,true);
        })
        .transition(0)
        .duration(function(){ return getRandomInt(100)+600; })
        .attr("opacity",0)
        .transition()
        .duration(function(){ return getRandomInt(100)+200; })
        .delay( function(){ return getRandomInt(100); })
        .attr("opacity", function(d){
            return d.id == current_district ? 1 : 0;
        })
        .attr("cx", e_nodes[c_currentLeader].x)
        .attr("cy", e_nodes[c_currentLeader].y)
        .on( "end", function(d,i) {
            appendToCommonsLog("district " + i +" queue:" + JSON.stringify(write_queue),d,current_district,true);
        })
        .transition()
        .duration(function(){ return getRandomInt(100)+600; })
        .delay( function(){ return getRandomInt(100); })
        .attr("opacity",1)
        .attr("cx", function(d){ return d.x;})
        .attr("cy", function(d){ return d.y})
        .on( "start", function(d,i) {
            appendToCommonsLog("requesting vote",d,i,true);
        })
        .transition()
        .duration(100)
        .attr("opacity",0)
        .transition()
        .duration(function(){ return getRandomInt(100)+600; })
        .delay( function(){ return getRandomInt(100)+50; })
        .attr("opacity",1)
        .attr("cx", e_nodes[c_currentLeader].x)
        .attr("cy", e_nodes[c_currentLeader].y)
        .on( "end", function(d,i) {
            appendToCommonsLog("district "+d.id + " voted",d,i,false);
        })
        .transition()
        .duration(100)
        .attr("opacity",0)
        .transition()
        .duration(function(){ return getRandomInt(100)+600; })
        .delay( function(){ return getRandomInt(100)+50; })
        .attr("opacity",1)
        .attr("cx", function(d){ return d.x;})
        .attr("cy", function(d){ return d.y})
        .on( "end", function(d,i) {
            appendToCommonsLog("broadcast results to "+i,d,i);
        })
        .transition()
        .duration(200)
        .attr("opacity",0)
        .on( "end", function(d,i) {
            handleParliamentWrite(current_district, d, write_queue);
        });
}


d3.select("#commonsParliament").on("click", function() {
    parliament(0);
});

function updateWriteQueue(districtnum){
    $("#c"+districtnum+"_write").text(districtWriteQueues[districtnum]);
}

function emptyWriteQueue(current_district){
    districtWriteQueues[current_district] = [];
    $("#c"+current_district+"_write").text("[]");
}

function handleParliamentWrite(current_district, node, write_q){
    if (node.id == current_district){
    // if (true)
        districtWriteQueues[current_district] = [];
        emptyWriteQueue(current_district);
        appendToCommonsLog("cleaning district "+current_district + " write queue",node,current_district,true);
        if (current_district<(c_total_nodes-1)){
            d3.selectAll(".bnode4"+current_district).remove();
            parliament(current_district+1);
        }
        d3.range(write_q.length).map(function(d){ if (getRandomInt(2) == 1){ c_write_queue.push(write_q[d]); }})
        $("#commonsWriteQueue").text(JSON.stringify(c_write_queue));
    }

}

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



function appendToCommonsLog(msg,node,index,flag){
    if (flag){
        if (node.id == index){
            $("#commons-log-text").append(timeStamp() + "<br><strong>" + msg+"</strong><br><br>")
            $("#commons-log-text").scrollTop($("#commons-log-text").prop("scrollHeight"));
        }
    }
    else {
        $("#commons-log-text").append(timeStamp() + "<br><strong>" + msg+"</strong><br><br>")
        $("#commons-log-text").scrollTop($("#commons-log-text").prop("scrollHeight"));
    }
}

var c_scores = d3.range(c_total_nodes).reduce(function(map, obj) {
    map[obj] = 0;
    return map;
}, {});

//Randomly update write queues
// every regular interval update scores
function updateCommonsScores(){
    // If currentLeader, multiply reward/deduction by 5
    // Else add or deduct random amount;
    // If leader's score is not the max, change color to red
    c_local_nodes.forEach(function(d){
        if (c_currentLeader == d){
            c_scores[d] += (getRandomInt(30) - 10);
        }
        else {
            c_scores[d] += (getRandomInt(30) - 10);
        }
    })
    $("#commonsScores1").text(JSON.stringify(c_scores, null, 2));
}
setInterval(updateCommonsScores, 500);



function updateWriteQueues(){
    d3.range(10).map(function(d){
        var prob = getRandomInt(100);
        if (prob > 60){
            districtWriteQueues[d].push(getRandomInt(10));
            updateWriteQueue(d);
        }
        prob = getRandomInt(100);
        if (prob > 60){
            districtWriteQueues[d].pop(getRandomInt(districtWriteQueues[d].length));
            updateWriteQueue(d);
        }
    });
}
setInterval(updateWriteQueues, 900);


function voteOfConfidence(){
    appendToLog("initiating election");

    var nodes = d3.range(c_total_nodes).map(function(d) { return {id: d} });
    nodes.forEach(function(n, i) {
        var coord = circleCoord(n, i, nodes.length);
        n.x = coord.x;
        n.y = coord.y;
    });

    var broadcast_node = c_svg.append("g")
        .attr("class","broadcast")
        .selectAll(".bnode")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("opacity", 0)
        .attr("class", "bnode")
        .attr("cx",function(d){ return nodes[c_currentLeader].x;  })
        .attr("cy", function(d){ return nodes[c_currentLeader].y ; })
        .transition()
        .duration(function(){ return getRandomInt(800) + 5000; })
        .attr("opacity",1)
        .attr("cx", function(d){ return d.x;})
        .attr("cy", function(d){ return d.y})
        .on( "end", function(d,i) {
            appendToCommonsLog("broadcasting vote request",d,i,true);
        })
        .transition(0)
        .duration(function(){ return getRandomInt(800) + 200; })
        .attr("opacity",0)
        .on( "end", function(d,i) {
            appendToCommonsLog(i + " received request",d,i,false);
        })
        .transition()
        .duration(function(){ return getRandomInt(800) + 5000; })
        .delay( function(){ return getRandomInt(500); })
        .attr("opacity",1)
        .attr("cx", nodes[c_currentLeader].x)
        .attr("cy", nodes[c_currentLeader].y)
        .on( "end", function(d,i) {
            appendToCommonsLog(i + " voted",d,i,false);
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
            appendToCommonsLog("voted processed",d,i,true);
        })
        .transition(100)
        .duration(1000)
        .attr("opacity",0)
        .on( "end", function(d,i) {
            transitionPM(d,i);
        })
        .exit().remove();
}

d3.select("#commonsPM").on("click", function() {
    voteOfConfidence();
});

function transitionPM(node,i){
    if (i==0){
        var newLeader = Object.keys(c_scores).reduce(function(a, b){ return c_scores[a] > c_scores[b] ? a : b });
        appendToCommonsLog("new prime minister: district "+newLeader+" ,node " + districtLeaders[newLeader]);

        appendToLog("transitioning prime minister");
        if (c_currentLeader != newLeader){
            console.log("changing stuff")
            d3.select("#"+commonsID + c_currentLeader)
                .classed("leader", false);
            d3.select(".col_" + c_currentLeader)
                .classed("leading-district",false);
            c_currentLeader = newLeader;
            d3.select("#"+ commonsID + c_currentLeader)
                .attr("class","node leader");
            d3.select(".col_" + c_currentLeader)
                .classed("leading-district",true);
            // electNewDistrictLeader(newLeader, true);
        }
        else {
            // electNewDistrictLeader(newLeader, false);
        }
    }
}

function transitionDistrictLeader(districtNumber, newLeader){
    d3.select("#district_" + districtNumber + "_" + districtLeaders[districtNumber])
        .classed("leader", false)
        .transition(districtNumber*1000)
        .duration(300)
        .attr("r", 15);
    districtLeaders[districtNumber] = newLeader;
    appendToCommonsLog("elected " + districtNumber+"."+districtLeaders[districtNumber]+" as district rep", null, null, false);
    d3.select("#district_" + districtNumber + "_" + newLeader)
        .classed("leader", true)
        .transition(districtNumber*1000+100)
        .duration(300)
        .attr("r", 23);
    d3.select("#commonslabel"+districtNumber).text(districtNumber+"."+newLeader);
}


function electNewDistrictLeader(districtNumber, must_elect_new) {
    if (districtNumber != c_currentLeader){
        appendToCommonsLog("district " + districtNumber+" electing new leader", null, null, false)
        var prob = getRandomInt(100);
        if (prob > 35 || must_elect_new){
            var new_district_leader = (getRandomInt(9) + districtLeaders[districtNumber])%10;
            transitionDistrictLeader(districtNumber, new_district_leader);
        }
        else {
            appendToCommonsLog("re-elected " + districtNumber+"."+districtLeaders[districtNumber]+ " as district rep", null, null, false)
        }
    }
}


function electCommons(){
    d3.range(c_total_nodes).map(function(d){
        setTimeout(electNewDistrictLeader(d,false),1000)
    })

}

d3.select("#commonsElection").on("click", function() {
    electCommons();
});