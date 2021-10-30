//width of node and height of line (update this manually from css)
var CIRCLE_WIDTH = 30;
var LINE_HEIGHT = 2;

var nodes = [];
var edges = [];

//explanatory messages shown when control button clicked
var messages = [
    "Click to place node.",
    "Click on node to delete.",
    "Click on node, then another node to connect them.",
    "Click on line to delete.",
    "Click and drag node to move it."
];

//keeps track of which control selected
var selected = -1;
const NEW_NODE = 0; 
const DELETE_NODE = 1;
const NEW_LINE = 2;
const DELETE_LINE = 3;
const MOVE_NODE = 4;

//first node clicked when adding line
var nodeHeld = null;

var stage_width;

var dragHandler;
var nodeMoving = null;

var deleted = [];


$(function() {
    
    
    stage_width = $("#stage").width();
    
    /* updates width of stage and position of nodes when window resized
    scales node's position by % of container, but keeps it in boundaries */
    var timer;
    $(window).resize(function() {
        clearTimeout(timer);
        timer = setTimeout(endresize, 100);
    });
    
    $(".control").click(function() {
        var index = $(".control").index($(this));

        $(".control").removeClass("selected");
        $(this).addClass("selected");
        
        $("#message").html(messages[index]);
        
        selected = index;
        if(selected == NEW_LINE) {
            //to wipe out data from last time
            nodeHeld = null; 
            $("#tempLine").css("top", 0)
            $("#tempLine").css("left", 0);
            $("#tempLine").css("width", 0);
        }
        if(selected == MOVE_NODE) {
            //to wipe out data from last time
            nodeMoving = null;
        }
    });
    
    $("#stage").click(function(e) {  
        var pos = $(this).offset();
        if(selected == NEW_NODE) {
            handleAddNode(e.pageX - pos.left, e.pageY - pos.top);
        }
        else if (selected == DELETE_NODE) {
            
        }
    });
    
    $("#stage").mouseenter(function() {
        if(selected == NEW_LINE && nodeHeld != null) {
            $("#tempLine").show();
        }
    });
    
    $("#stage").mouseleave(function() {
//        console.log("left!");
        if(selected == NEW_LINE) {
            $("#tempLine").hide();
        }
        if(selected == MOVE_NODE) {
            nodeMoving = null;
        }
    });
    
    $("#stage").mousemove(function(e) {
        //update position of line when mouse moves
        if(selected == NEW_LINE && nodeHeld != null) {
            var pos = getXandY(e);
//            console.log(pos.x + " " + pos.y);
//            console.log("active");
            var line = createLine(parseInt(nodeHeld.css("left")) + CIRCLE_WIDTH / 2,
                                  parseInt(nodeHeld.css("top")) + CIRCLE_WIDTH / 2,
                                  pos.x, 
                                  pos.y);
            $("#tempLine").css("left", line.css("left"));
            $("#tempLine").css("top", line.css("top"));
            $("#tempLine").css("width", line.css("width"));
            $("#tempLine").css("transform", line.css("transform"));
        }
        //update position of node when mouse moves
        if(selected == MOVE_NODE && nodeMoving != null) {
            
            var pos = getXandY(e);
            var processedCoords = pointerToLT(pos.x, pos.y);
            nodeMoving.css("left", processedCoords.left);
            nodeMoving.css("top", processedCoords.top);
            updateLinesFromNodes();
            //console.log(processedCoords.left + " " + processedCoords.top);
        }
        
    })
    
    $("#stage").on("click", ".node", function(e) {
        if(selected == DELETE_NODE) {
            console.log("delete node clicked");
            handleDeleteNode($(this));
        }
        if(selected == NEW_LINE) {
            handleAddLine($(this));
        }
    });
    
    $("#stage").on("click", ".line", function(e) {
        if(selected == DELETE_LINE) {
            handleDeleteLine($(this));
        } 
    });
    
    $("#stage").on("mousedown", ".node", function(e) {
        if(selected == MOVE_NODE) {
            nodeMoving = $(this);
        }    
    });
    
    $("#stage").mouseup(function(e) {
        //handle end of node moving
        if(selected == MOVE_NODE && nodeMoving != null) {
            handleMoveNodeMouseUp(e);
        }
    });
    
    $("#stage").on("mouseup", ".node", function(e) {
        if(selected == MOVE_NODE && nodeMoving != null) {
            handleMoveNodeMouseUp(e);
        }
    });
    
    $("#shortest-path-button").click(function() {
       console.log("btn clicked!"); 
        handleShortestPathBtnClicked();
    });
    
    /*x and y position of mouse relative to #stage
    only call if mouse over #stage */
    function getXandY(event) {
        var pos = $("#stage").offset();
        return {x:(event.pageX - pos.left), y:(event.pageY - pos.top)};
    }
    
    function createLine(x1, y1, x2, y2) {
        var line = $("<div></div>");
        line.addClass("line");
        var xDiff = Math.abs(x1 - x2);
        var yDiff = Math.abs(y1 - y2);
        var width = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        line.css("left", Math.round((x1 + x2) / 2 - width / 2));
        line.css("top", Math.round((y1 + y2) / 2 - LINE_HEIGHT / 2));
        line.css("width", width);
        var angle = Math.asin(yDiff / width) * 180 / Math.PI;
        if(((y2 - y1) / (x2 - x1)) < 0) {
            //console.log("slope: " + ((y2 - y1) / (x2 - x1)))
            angle *= -1;
        }
//        console.log(angle);
        line.css("transform", "rotate(" + /*Math.round(*/angle/*)*/ + "deg)");
        return line;
    }
    
    function updateLinesFromNodes() {
        for(var ind = 0; ind < edges.length; ind++) {
            var edge = edges[ind];
            var a = edge.a;
            var b = edge.b;
            var line = createLine(parseInt(a.css("left")) + CIRCLE_WIDTH / 2, 
                              parseInt(a.css("top")) + CIRCLE_WIDTH / 2,
                              parseInt(b.css("left")) + CIRCLE_WIDTH / 2,
                              parseInt(b.css("top")) + CIRCLE_WIDTH / 2);
            edge.nodeline.remove();
            edge.nodeline = line;
            $("#stage").append(line);
        }
    }
    
    function endresize() {
        //console.log("resize over"); 
        var prev = stage_width;
        stage_width = $("#stage").width();
        for(var ind = 0; ind < nodes.length; ind++) {
            var node = nodes[ind];
            var left = Math.round(node.x * stage_width);
            var max = Math.round(stage_width - CIRCLE_WIDTH);
            node.elem.css("left", Math.min(left, max));
        }
        updateLinesFromNodes();
    }
    
    //convert mouse pointer coords to left and top css properties of node
    function pointerToLT(xCoord, yCoord) {
        xCoord = Math.max(CIRCLE_WIDTH / 2, xCoord);
        xCoord = Math.min(xCoord, $("#stage").width() - CIRCLE_WIDTH / 2);
        yCoord = Math.max(yCoord, CIRCLE_WIDTH / 2);
        yCoord = Math.min(yCoord, $("#stage").height() - CIRCLE_WIDTH / 2);
        xCoord -= CIRCLE_WIDTH / 2;
        yCoord -= CIRCLE_WIDTH / 2;
        xCoord = Math.round(xCoord);
        yCoord = Math.round(yCoord);
        return {left: xCoord, top:yCoord};
    }
    
    function updateNodeX(nodeElem) {
        for(var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if(node.elem.is(nodeElem)) {
//                console.log("changing internals");
                node.x = parseInt(nodeElem.css("left")) / $("#stage").width();
                return;
            }
        }
    }
    
    function nodeNumToLabel(nodeNum) {
        return $(".node").eq(nodeNum).text();
    }
    
    function labelToNodeNum(label) {
        var returnVal;
        $(".node").each(function(ind) {
            if($(this).text() == label) {
                console.log(ind);
                returnVal = ind;
            }
        });
        return returnVal;
    }
    
    function genDisplay(processArray) {
        console.log(processArray);
        var ind = 0;
        var ind2 = 0;
        var interval = setInterval(function() {
            if(ind2 >= processArray[ind][1].length) {
                $(".node").removeClass("visiting");
                $(".node").eq(processArray[ind][0]).addClass("visited");
                ind++;
                ind2 = 0;
            }
            if(ind >= processArray.length) {
                clearInterval(interval);
            }
            console.log(ind, ind2);
            $(".node").removeClass("on");
            var node = $(".node").eq(processArray[ind][0]);
            var nodeVisiting = $(".node").eq(processArray[ind][1][ind2]);
            nodeVisiting.addClass("visiting");
            node.addClass("on");
            ind2++;
        }, 1000);
    }
    
    function printToSidebar(txt) {
        $("#log").append("<p>" + txt + "</p>");
    }
    
    function callShortestPath(nodeNum1, nodeNum2) {
        var nodeNum1 = labelToNodeNum(nodeNum1);
        var nodeNum2 = labelToNodeNum(nodeNum2);
        console.log(nodeNum1, nodeNum2);
        var result = shortestPath(nodeNum1, nodeNum2);
        genDisplay(result.process);
        
        printToSidebar("Length: " + result.length);
        
        //Print out path
        var vertlist = [];
        var vert = result[result.length - 1][0];
        while(vert.prevVertex != null) {
            vertlist.push(vert);
            vert = vert.prevVertex;
        }
        console.log(vertlist);
    }
    
    function handleAddNode(xCoord, yCoord) {
        //place node inside stage boundaries
        xCoord = Math.max(CIRCLE_WIDTH / 2, xCoord);
        xCoord = Math.min(xCoord, $("#stage").width() - CIRCLE_WIDTH / 2);
        yCoord = Math.max(yCoord, CIRCLE_WIDTH / 2);
        yCoord = Math.min(yCoord, $("#stage").height() - CIRCLE_WIDTH / 2);
        
        //create node DOM element and associated node object in list
        var circle = $("<div></div>").addClass("node");
        var node = {elem:circle, x:(xCoord / $("#stage").width())};
        nodes.push(node);
        xCoord -= CIRCLE_WIDTH / 2;
        yCoord -= CIRCLE_WIDTH / 2;
        circle.css("left", Math.round(xCoord));
        circle.css("top", Math.round(yCoord));
        if(deleted.length != 0) {
            circle.html(deleted.shift());
        }
        else {
            circle.html(nodes.length - 1);
        }
        $("#stage").append(circle);
        updateSelectBox();
    }

    function handleDeleteNode(node) {
        //delete associated edges
        for(var ind = 0; ind < edges.length; ind++) {
            var edge = edges[ind];
            if(edge.a.is(node) || edge.b.is(node)) {
                console.log(edge);
                
                edge.nodeline.hide();
                edges.splice(ind, 1);
                ind--;
            }
        }
        deleted.push(node.text());
        deleted.sort();
        var index = $(".node").index(node);
        console.log(index);
        nodes.splice(index, 1);
        node.remove();
        updateSelectBox();
    }
    
    function handleAddLine(node) {
        
        if(nodeHeld == null) {
            nodeHeld = node;
            $("#tempLine").show();
            return;
        }
        var line = createLine(parseInt(nodeHeld.css("left")) + CIRCLE_WIDTH / 2, 
                              parseInt(nodeHeld.css("top")) + CIRCLE_WIDTH / 2,
                              parseInt(node.css("left")) + CIRCLE_WIDTH / 2,
                              parseInt(node.css("top")) + CIRCLE_WIDTH / 2);
        $("#stage").append(line);
        var edge = {a: nodeHeld, b: (node), nodeline:line};
        edges.push(edge);
        
        //reset tempLine
        $("#tempLine").css("top", 0)
        $("#tempLine").css("left", 0);
        $("#tempLine").css("width", 0);
        nodeHeld = null; 
    }
    
    function handleDeleteLine(line) {
        for(var ind = 0; ind < edges.length; ind++) {
            if(edges[ind].nodeline.is(line)) {
                edges.splice(ind, 1);
                line.remove();
                return;
            }
        }
    }
    
    //place node at final position and update node list with position
    function handleMoveNodeMouseUp(e) {
//        console.log("mouse up");
        var pos = getXandY(e);
        var processedCoords = pointerToLT(pos.x, pos.y);
        nodeMoving.css("left", processedCoords.left);            
        nodeMoving.css("top", processedCoords.top);
        updateNodeX(nodeMoving);
        updateLinesFromNodes();
        nodeMoving = null;
    }
    
    function updateSelectBox() {
        $(".shortest-path .form-control").empty();
        var options = [];
        for(var ind = 0; ind < nodes.length; ind++) {
            options.push($(".node").eq(ind).text());
        }
        options.sort();
        for(var ind = 0; ind < options.length; ind++) {
            $(".shortest-path .form-control").append("<option>" + options[ind] + "</option>");   
        }
    }
    
    function handleShortestPathBtnClicked() {
        var nodeNum1 = parseInt($("#node1 option:selected").text());
        var nodeNum2 = parseInt($("#node2 option:selected").text());
        if(nodeNum1 != nodeNum2) {
            callShortestPath(nodeNum1, nodeNum2);
        }
        $(".node").removeClass("on");
        $(".node").removeClass("visited");
        $(".node").removeClass("visiting");
    }
});	