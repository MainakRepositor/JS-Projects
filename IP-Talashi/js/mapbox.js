const api_key = "at_vJ5M8SbAgxzcfLOwKjBwmnoegSt6D";
const searchField = document.querySelector("#searchField");
const submit = document.querySelector("#submit");
const ipAddress = document.querySelector("#ip-address");
const ipLocation = document.querySelector("#location");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");
const placeholder = document.querySelectorAll(".details__placeholder");
const detailElems = document.querySelectorAll(".details--medium");
const map = document.querySelector("#map");

$(document).ready(() => {

    fetch("https://api.ipify.org?format=json")

    .then((resp) => {
        return resp.json();
    })

    .then((data) => {
        userIPDetails(data.ip);
    });

});

searchField.addEventListener('change', () => {

    replaceIPDetails(searchField.value);

});

submit.addEventListener('click', () => {

    replaceIPDetails(searchField.value);

});

function userIPDetails(ip) {

    fetch(`https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=${ip}`)   

    .then((resp) => resp.json())

    .then((data) => {

        ipAddress.innerText = data.ip;

        ipLocation.innerText = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;

        timezone.innerText = `UTC ${data.location.timezone}`;

        isp.innerText = data.isp;

        placeholder.forEach(function(element){
            element.classList.add("none")
        });

        detailElems.forEach(function(element){
            element.classList.add("show")
        });

        viewMap(data.location.lng, data.location.lat);

    })

}

function replaceIPDetails(ip) {

    var ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    var domainFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (searchField.value !== "") {

        console.log(searchField.value)

        if(searchField.value.match(ipFormat)) {
    
            fetch(`https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=${ip}`)
            
            .then((resp) => resp.json())
        
            .then((data) => {
                
                console.log(data);                
    
                ipAddress.innerText = data.ip;
    
                ipLocation.innerText = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
    
                timezone.innerText = `UTC ${data.location.timezone}`;
    
                isp.innerText = data.isp;
    
                viewMap(data.location.lng, data.location.lat);
        
            })
    
        }
    
        else if (searchField.value.match(domainFormat)) {
    
            fetch(`https://geo.ipify.org/api/v1?apiKey=${api_key}&domain=${ip}`)
            
            .then((resp) => resp.json())
        
            .then((data) => {
                
                console.log(data);                
    
                ipAddress.innerText = data.ip;
    
                ipLocation.innerText = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
    
                timezone.innerText = `UTC ${data.location.timezone}`;
    
                isp.innerText = data.isp;
    
                viewMap(data.location.lng, data.location.lat);
        
            })
    
        } 
    
        else if (searchField.value.match(emailFormat)) {
    
            fetch(`https://geo.ipify.org/api/v1?apiKey=${api_key}&email=${ip}`)
            
            .then((resp) => resp.json())
        
            .then((data) => {
                
                console.log(data);                
    
                ipAddress.innerText = data.ip;
    
                ipLocation.innerText = `${data.location.city}, ${data.location.country} ${data.location.postalCode}`;
    
                timezone.innerText = `UTC ${data.location.timezone}`;
    
                isp.innerText = data.isp;
    
                viewMap(data.location.lng, data.location.lat);
        
            })
    
        } 

    }
    
    else

    {

        console.log(searchField.value)

        fetch("https://api.ipify.org?format=json")

        .then((resp) => {
            return resp.json();
        })

        .then((data) => {
            userIPDetails(data.ip);
        });
    
    }

}

function viewMap(lng, lat) {

    mapboxgl.accessToken = 'pk.eyJ1Ijoib2FrLWdyYXBoaWNzIiwiYSI6ImNra3hxenlzMjBzeG4ycm80NHZ3MGJneTAifQ.E7zQKsCgBb2FShViP-GUcw';
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: 12
    });
     
    map.addControl(new mapboxgl.NavigationControl({showCompass: false}), 'bottom-right');
    
    var geojson = {
        
        type: 'FeatureCollection',
    
        features: [{
    
            type: 'Feature',
            
            geometry: {
            type: 'Point',
            coordinates: [lng, lat]
            }
    
        }]
    
    };
          
    geojson.features.forEach(function(marker) {
    
    var el = document.createElement('div');
    el.className = 'marker';
    
    new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });
    
}
