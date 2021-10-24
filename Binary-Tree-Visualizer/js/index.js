const output = document.getElementById("tree");

function binary(){
    const value = document.getElementById("inp").value;
    var arr = value.split(" ")
    var num = [];

    for(var i = 0; i < arr.length;i++){
        if(!isNaN(arr[i])){
            num.push(arr[i])
        }
    }
    createNodes(num);
    const el = document.querySelector('#tree');
    el.onwheel = zoom;

}

var tree = document.getElementById("tree");
var starty,startx,scrleft,scrtop,isdown;


tree.addEventListener('mousedown',e => MouseDown(e));  
tree.addEventListener('mouseup',e => mouseUp(e))
tree.addEventListener('mouseleave',e=>mouseLeave(e));
tree.addEventListener('mousemove',e=>mouseMove(e));

function MouseDown(e){
    isdown = true;
    startx = e.pageX - tree.offsetLeft;
    starty = e.pageY - tree.offsetTop;
    scrleft = tree.scrollLeft;
    scrtop = tree.scrollTop;
}

function mouseUp(e){
    isdown = false;
}

function mouseLeave(e){
    isdown = false;
}

function mouseMove(e){
    if(isdown){
        e.preventDefault();

        var y = e.pageY - tree.offsetTop;
        var goY = y - starty;
        tree.scrollTop = scrtop - goY;

        var x = e.pageX - tree.offsetLeft;
        var goX = x - startx;
        tree.scrollLeft = scrleft - goX;
    }
}
let scale = 1;


function zoom(event) {
    const el = document.querySelector('svg');

    event.preventDefault();
  
    scale += event.deltaY * -0.001;
  
    // Restrict scale
    scale = Math.min(Math.max(.250, scale), 1);
  
    // Apply scale transform
    el.style.transform = `scale(${scale})`;
  }