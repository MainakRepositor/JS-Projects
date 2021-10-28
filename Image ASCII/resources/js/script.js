const DEFAULT_ACII = "AAAAAA@@@@@@@@@@@@@@################$$$$$$$$$$$$$$$$$";
var image = "";
var img;
window.onload = function () {

  let inputASCII = document.querySelector('#ascii');
  inputASCII.value = DEFAULT_ACII;

  let input = document.querySelector("#file");
  input.onchange = function (e) {
    let file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = function () {
      loadImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };

  input = document.querySelector("#save");
  input.addEventListener("click", function (e) {

    let link = document.createElement("a");
    link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodeURIComponent(image));
    link.setAttribute("download", "image.txt");
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);

  });

  loadImage("./logo.gif");
  inputASCII.addEventListener("input", ()=> {
    handleImage(img);
  });
}

loadImage = function (src) {
  img = document.createElement("img");
  img.onload = function () {
    handleImage(img);
  };
  img.src = src;
}
handleImage = function (img) {
  // let ascii = "@#*+=-:·";
  let ascii = document.querySelector('#ascii').value;
  if(!ascii || ascii.trim().length === 0) {
    ascii = DEFAULT_ACII;
  }
  let w = 320;
  let h = 320;
  
  let canvas1 = document.querySelector("#canvas");
  canvas1.width = w;
  canvas1.height = h;
  let ctx1 = canvas1.getContext("2d");
  ctx1.font = "5px monospace";

  let canvas2 = document.createElement("canvas");
  canvas2.width = w;
  canvas2.height = h;
  let ctx2 = canvas2.getContext("2d");
  ctx2.scale((w / img.width) * 0.5, (h / img.height) * 0.5);
  ctx2.drawImage(img, 0, 0);

  let data = ctx2.getImageData(0, 0, w, h).data;
  let i, j, r, g, b, grayscale, index;
  
  image = "";
  for (i = 0; i < h >> 1; i++) {    
    for (j = 0; j < w >> 1; j++) {
      let off = (i * h + j) << 2;
      r = data[off    ];
      g = data[off + 1];
      b = data[off + 2];
      grayscale = (r + g + b) / 3.0;
      index = Math.floor((grayscale / 255) * (ascii.length - 1));
      if(index >= ascii.length) console.log("error")
      let char = ascii.charAt(index);
      ctx1.fillText(char, j << 1, i << 1);
      image += char;
    }
    image += '\n';
  }

}
