//all functions here assume nodes and edges have been created

function print() {
    console.log(nodes);
    console.log(edges);
}


//0 -> empty 1 -> neighbor
function buildAdjacencyMatrix(nodes, edges) {
    var adjacencyMatrix = [];
    for(var i = 0; i < nodes.length; i++) {
        var row = [];
        for(var j = 0; j < nodes.length; j++) {
            row.push(0);
        }
        adjacencyMatrix.push(row);
    }
    
    for(var i = 0; i < edges.length; i++) {
        var edge= edges[i];
        for(var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            if(edge.a.is(node.elem)) {
                for(var k = 0; k < nodes.length; k++) {
//                    console.log("at edge " + i + " with node " + k + "as a, testing node " + k + "to see if it's b");
                    var node2 = nodes[k];
                    if(edge.b.is(node2.elem)) {
                        adjacencyMatrix[j][k] = 1;
                        adjacencyMatrix[k][j] = 1;
                     }
                }
            }
        }
    }
    return adjacencyMatrix;
}

function getNeighbors(vertex, vertices, adjacencyMatrix) {
//    console.log(vertex, vertices, adjacencyMatrix);
    var neighbors = [];
    var arr = adjacencyMatrix[vertex.name];
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == 1) {
            neighbors.push(vertices[i]);
//            console.log(i);
        }
    }
//    console.log(neighbors);
    return neighbors;
}

function nextUnvisitedNeighbor(vertex, vertices, adjacencyMatrix) {
    var neighbors = getNeighbors(vertex, vertices, adjacencyMatrix);
    for(var ind = 0; ind < neighbors.length; ind++) {
        var neighbor = neighbors[ind];
        if(!neighbor.visited) {
//            console.log(neighbor.name);
            return neighbor;
        }
    }
    return null;
}

//takes two numbers
function shortestPath(startVertex, endVertex) {
    //setup
//    startVertex = labelToNodeNum(startVertex);
//    endVertex = labelToNodeNum(endVertex);
    var result = {process:[], length:null};
    var vertices = nodes;
    for(var ind = 0; ind < vertices.length; ind++) {
        var vertex = vertices[ind];
        vertex.name = ind;
        vertex.length = null;
        vertex.prevVertex = null;
        vertex.visited = false;
        vertex.nextVertex = null;
    }
    startVertex = vertices[startVertex];
    endVertex = vertices[endVertex];
    var unvisitedVertices = [];
    
    var adjacencyMatrix = buildAdjacencyMatrix(nodes, edges);
//    console.log(nextUnvisitedNeighbor(vertices[0], vertices, adjacencyMatrix));
    //console.log(getNeighbors(vertices[0], vertices, adjacencyMatrix));
    
    
    var done = false;
    startVertex.visited = true;
    startVertex.length = 0;
    unvisitedVertices.push(startVertex);
//    console.log(startVertex, endVertex, unvisitedVertices);
    while(!done && unvisitedVertices.length != 0) {
        var frontVertex = unvisitedVertices[0];
        unvisitedVertices.shift();
        var processEntry = [frontVertex.name, []];
        console.log("removed vertice " + frontVertex.name + " adding vertices: ");
        while(!done && nextUnvisitedNeighbor(frontVertex, vertices, adjacencyMatrix) != null) {
            var nextNeighbor = nextUnvisitedNeighbor(frontVertex, vertices, adjacencyMatrix);
            if(nextNeighbor.visited == false) {
                nextNeighbor.visited = true;
                nextNeighbor.length = 1 + frontVertex.length;
                nextNeighbor.prevVertex = frontVertex;
                unvisitedVertices.push(nextNeighbor);
                processEntry[1].push(nextNeighbor.name);
                console.log(nextNeighbor.name);
            }
            if(nextNeighbor.name == endVertex.name) {
                console.log("added vertice " + endVertex.name + ", search over");
                done = true;
            }
        }
        result.process.push(processEntry);
    }
    result.length = endVertex.length;
    console.log("Path Length: " + endVertex.length);
    console.log(vertices);
    console.log(result);
    
    //print array
    
    return result;
}