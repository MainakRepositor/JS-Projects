function Node(value,right,left,parent = "",children = []){
    this.value = value;
    this.right = right;
    this.left = left;
    this.parent = parent;
    this.children = children;
    this.isRight = null;
    this.isLeft = null;

}

function createTree(arr){


    for(var i = 1;i<arr.length;i++){
        recursive(arr[0],arr[i])
    }

    createData(arr[0]);
    remove();
    try{
        drawGraph(arr);
    } catch{
        console.log("No Input");
    }

}

function remove(){

    var graph = document.querySelector('svg');
    if(graph) {graph.parentElement.removeChild(graph)};

}

function recursive(root,node){
    var a = Number(node.value)
    var b = Number(root.value)
   if(a < b){
       if(root.right == null){
            root.right = node;
            node.isRight = true;
       }else{
           recursive(root.right,node);
       }
   } else if(a > b){
       if(root.left == null){
            root.left = node;
            node.isLeft = true
       } else{
           recursive(root.left,node);
       }
   }
   
}

function createData(node){

    if(node == null){return}

    if(node.right){
        node.children.push(node.right);
        node.right.parent = node;
    }

    if(node.left){
        node.children.push(node.left);
        node.left.parent = node;

    }


    createData(node.left);
    createData(node.right);

}

function createNodes(list){
    new_list = [];

    for(var i = 0;i<list.length;i++){
        if(list[i] == ""){continue}
        new_list.push(new Node(list[i],null,null));

    }

    

    createTree(new_list)
}