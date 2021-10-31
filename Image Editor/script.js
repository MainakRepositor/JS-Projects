var bright = document.getElementById("bright");
			var bri_c = document.getElementById("bri_check");
			var scale = document.getElementById("greyscale");
			var gre_c = document.getElementById("gre_check");
			var cont = document.getElementById("contrast");
			var cont_ch = document.getElementById("cont_check");
			var invert = document.getElementById("invert");
			var bw = document.getElementById("bwhite");
			var ctx = document.getElementById("canvas").getContext("2d");
			var canvas = document.getElementById("canvas");

			var imageLoader = document.getElementById("imageLoader");
			imageLoader.addEventListener("change", handleImage);
			bright.addEventListener("change", brights);
			bri_c.addEventListener("click", brights);
			scale.addEventListener("change", brights);
			gre_c.addEventListener("click", brights);
			cont.addEventListener("change", brights);
			cont_ch.addEventListener("click", brights);
			invert.addEventListener("click", brights);
			bw.addEventListener("click", brights);


			var img, mydata;;
			function handleImage(e) {
				var reader = new FileReader();
				reader.onload = function(event) {
				img = new Image();
					img.onload = function() {
					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0);
					newImage = ctx.getImageData(0, 0, 800, 400);
					mydata = newImage.data;
					newImage.data = mydata;
					ctx.putImageData(newImage, 0, 0);
					};
				img.src = event.target.result;
				};
				if(e.target.id == "imageLoader"){
					reader.readAsDataURL(e.target.files[0]);
				}
			}




			function brights(){

				ctx.drawImage(img, 0, 0);
				newImage = ctx.getImageData(0,0,img.width,img.height);
				mydata = newImage.data;
				newImage.data = mydata;
				ctx.putImageData(newImage, 0, 0);

				//start brightness
				if(bri_c.checked == true){
					for(var i = 0;i<mydata.length;i+=4){
						mydata[i] 	= mydata[i]   * bright.value;
						mydata[i+1] = mydata[i+1] * bright.value;
						mydata[i+2] = mydata[i+2] * bright.value;
					}
				}
				//End brightness

			//start greyscale 
				if(gre_c.checked == true){
					for(var i = 0;i<mydata.length;i+=4){
						var grey = (mydata[i] + mydata[i+1] + mydata[i+2]) / scale.value;
						mydata[i] 	= grey;
						mydata[i+1] = grey;
						mydata[i+2] = grey;
					}
				}
			//end grey scale

			//start Contrast 
				if(cont_ch.checked == true){
					for(var i = 0;i<mydata.length;i+=4){
						var factor = (259 * (cont.value + 255)) / (255 * (259 - cont.value));
						mydata[i] 	= factor * (mydata[i] - 128) + 128;
						mydata[i+1] = factor * (mydata[i+1] - 128) + 128;
						mydata[i+2] = factor * (mydata[i+2] - 128) + 128;
					}
				}
			//end Contrast

			//start invert picture
				if(invert.checked == true){
					for(var i = 0;i<mydata.length;i+=4){
						mydata[i] 	= 255 - mydata[i];
						mydata[i+1] = 255 - mydata[i+1];
						mydata[i+2] = 255 - mydata[i+2];
					}
					newImage.data = mydata;
					ctx.putImageData(newImage,0,0);
				}
			//End invert picture

			//start B/W picture
				if(bw.checked == true){
					for(var i = 0;i< mydata.length;i+=4){
						var grey = (mydata[i] + mydata[i+1] + mydata[i+2]) / 3;
						if(grey < 128){
							mydata[i] = mydata[i+1] = mydata[i+2] = 0;
						}else{
							mydata[i] = mydata[i+1] = mydata[i+2] = 255;
						}
					}
				newImage.data = mydata;
				ctx.putImageData(newImage,0,0);
				}
			//End B/W picture
			newImage.data = mydata;
			ctx.putImageData(newImage,0,0);
			}
						/*End Editing Function*/