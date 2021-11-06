// Global variables
var graphColors = ['#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#4472C4', '#70AD47', '#1F4E79', '#843C0C', '#525252', '#7F6000'];
var graphData = [];
var graphLabels = [];
var idnr = 0;

var add = function(){
    if (document.getElementById("extraInputs").childNodes.length < 9){
        document.getElementById("max").innerHTML = null;
        
        // Creates the unique id for the div
        idnr++;
    
        var divIdText = "div";
        var divId = divIdText + idnr;
    
        // Places a div
        var inputArea = document.getElementById("extraInputs");
        var div = document.createElement("div");
        div.id = divId;
        inputArea.appendChild(div);
        
        // Adds name and data in DIV
        var inputs = function(){
            var place = document.getElementById(divId);
            // Name
            var inputName = document.createElement("input");
            inputName.setAttribute('type', 'text');
            inputName.setAttribute('class', 'names');
            
            // Data
            var inputData = document.createElement("input");
            inputData.setAttribute('type', 'number');
            inputData.setAttribute('class', 'numbers');
            inputData.setAttribute('min', '0');
            
            //Button Delete
            var del = document.createElement('button');
            del.setAttribute('onclick', 'del(event)');
            del.setAttribute('class', 'remove');
            del.innerHTML = 'X';
            
            place.appendChild(inputName);
            place.appendChild(inputData);
            place.appendChild(del);
            
        };
        
        inputs();
        }
    else{  
        
        var msg = document.createElement('p');
        msg.setAttribute('class', 'msg');
        var t = document.createTextNode("MAX 10 DATA INPUTS");
        msg.appendChild(t);
        document.getElementById('max').appendChild(msg);
        
        document.getElementById('add').setAttribute('disabled', 'true');
    }
};

// delete the extra Input
var del = function(event){
    document.getElementById('max').innerHTML = null;
    document.getElementById('add').removeAttribute('disabled');
    
    var inputArea = document.getElementById('extraInputs');
    var child = event.target.parentNode;
    inputArea.removeChild(child); 
};


// Calculates the data total for the graph
var getTotal = function(){
    var myTotal = 0;
    for (var c = 0; c < graphData.length; c++) { 
        myTotal += +graphData[c];
    }
    return myTotal;
};
    
// Calculates the length of the legend in the canvas (to place legends)
var legendLength = function(){
    var labels = 0;
    for (var d = 0; d < graphLabels.length; d++){
        labels += 20; 
    }
    return labels;
};

var collectData = function(){
    graphData = []; 
    // Puts all data values in the array
    var firstInputValue = document.getElementById("number0").value;
    graphData.push(firstInputValue);
    var childsNr = document.getElementById("extraInputs").childNodes;  
    for (var i = 0; i < childsNr.length; i++){   
        //This part give the additional inputs an unique ID 
        var inputArea = document.getElementById("extraInputs");
        var inputDiv = inputArea.children[i];
        var inputElement = inputDiv.children[1];
        var inputId = 'number' + (i+1);
        inputElement.id = inputId;
        var inputValue = document.getElementById(inputId).value; 
        graphData.push(inputValue);
    }   
};

var collectLabels = function(){
    graphLabels = []; 
    // Puts all name values in the array
    var firstInputValue = document.getElementById("name0").value;
    graphLabels.push(firstInputValue);
    var childsNr = document.getElementById("extraInputs").childNodes;  
    for (var i = 0; i < childsNr.length; i++){   
        //This part give the additional inputs an unique ID 
        var inputArea = document.getElementById("extraInputs");
        var inputDiv = inputArea.children[i];
        var inputElement = inputDiv.children[0];
        var inputId = 'name' + (i+1);
        inputElement.id = inputId;
        var inputValue = document.getElementById(inputId).value; 
        graphLabels.push(inputValue);
    }   
};

//This function creates the graph
var gengraph = function(){
    collectLabels();
    collectData();
    
    for (var i = 0; i < graphData.length; i++){
        var numbersID = "number" + i;
        var namesID = "name" + i;
        
        var numbers = document.getElementById(numbersID);
        var names = document.getElementById(namesID);
        
        if(names.value === "" || numbers.values === "" || isNaN(numbers.value)){
            var canvas = document.getElementById("graphArea");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            alert("Some of the inputs are not filled in correctly.");
            break;
            
        }
        
        else{
            var canvas = document.getElementById("graphArea");
            var ctx = canvas.getContext("2d");
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // This part creates the pie graph
            var dataTotal = getTotal();
            var lastEnd = 1.5*Math.PI;
            
            for (var e = 0; e < graphData.length; e++){
                ctx.fillStyle = graphColors[e];   
                ctx.beginPath();
                ctx.moveTo(200,200);
                ctx.arc(200, 200, 150, lastEnd, lastEnd+(Math.PI*2*(graphData[e]/dataTotal)));
                ctx.lineTo(200,200);
                ctx.fill();
                ctx.lineWidth=2;
                ctx.strokeStyle = '#FFF';
                lastEnd += Math.PI*2*(graphData[e]/dataTotal);
            }
            
            var labelStart = ((400 - legendLength())/2) + 5;
            
            for (var f = 0; f< graphLabels.length; f++){
                ctx.fillStyle = graphColors[f];
                ctx.fillRect(420, labelStart, 10, 10);
                ctx.fillStyle= "#007da3";
                ctx.font="30px Yanone Kaffeesatz";
                ctx.fillText(graphLabels[f], 440, labelStart + 8);
                labelStart += 30; 
            }
        }
    }
}

// Clears everything
var cleargraph = function(){
    
    document.getElementById('max').innerHTML = null;
    
    // Clears the graph canvas
    var canvas = document.getElementById('graphArea');
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0, canvas.width, canvas.height);
        
    // Clears the extra inputs
    var inputArea = document.getElementById('extraInputs');
    inputArea.innerHTML = null;
    
    // Clears all the arrays
    graphData = [];
    graphLabels = [];
    
    // Clears the firstInput value to null
    var firstName = document.getElementById('name0');
    var firstData = document.getElementById('number0');
    firstName.value = null;
    firstData.value = null;
};
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    