dayNightTheme = () => {
  let date = new Date(); // Get the current date
  let hour = date.getHours(); // Get the current hour

  if(hour >= 7 && hour < 19){ //  If the current hour is between 7am and 7pm
    document.body.style.backgroundColor = 'white';// Set the background color to white
    document.body.style.color = 'black';// Set the text color to black
  }
  else{// Else, if the current hour is between 7pm and 7am
    document.body.style.backgroundColor = 'black'; // Set the background color to black
    document.body.style.color = 'white'; // Set the text color to white     
  }
}

window.addEventListener('load', dayNightTheme); // Get the input element

document.querySelector("#input").addEventListener("keydown", (event) => { // Get the input element
  if (event.key == "Enter")
    apiRequest();
});

document.querySelector("#search").addEventListener("click", () => {
    apiRequest();
});

apiRequest = () => {

  document.querySelector("#grid").textContent = "";

  const url = 'https://api.unsplash.com/search/photos?query='+input.value+'&per_page=30&client_id=SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo';

  fetch(url)

  .then(response => {
    if (!response.ok) throw Error(response.statusText);
      return response.json();
   })

   .then(data => {
      loadImages(data);
   })

   .catch(error => console.log(error));   
}

loadImages = (data) => {
  for(let i = 0;i < data.results.length;i++){
    let image = document.createElement("div");
    image.className = "img";
    image.style.backgroundImage = "url("+data.results[i].urls.raw + "&w=1366&h=768" +")";
    image.addEventListener("dblclick", function(){
      window.open(data.results[i].links.download, '_blank');
    })
    document.querySelector("#grid").appendChild(image);
  }
}
