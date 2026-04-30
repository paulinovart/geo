import "./style.css";
import "../node_modules/leaflet/dist/leaflet.css";
import L from "leaflet"; // import de la classe qui provient de leafret
import { marker } from "leaflet";
import json from "./assets/countries.json";
let countryNameContainer = document.querySelector("#country-name-container");
let scoreContainer = document.querySelector("#score");
let pointsContainer = document.querySelector("#points");
let targetCountry;
let targetCountryName;
let targetCountryLatLng;
let clickedLat;
let clickedLng;
let clickedLatLng;
let targetCountryLat;
let targetCountryLng;
let userMarker;
let polyline;
let targetmarket;
let score;
let points;

const BASE_URL = " https://restcountries.com";

const getcountries = async () => {
  const random = Math.floor(Math.random() * json.length);

  targetCountry = json[random];
  targetCountryName = targetCountry.name;
  countryNameContainer.innerText = "Find : " + targetCountryName;
  targetCountryLatLng = [targetCountry.latitude, targetCountry.longitude];
  targetCountryLat = targetCountry.latitude;
  targetCountryLng = targetCountry.longitude;

  console.log(targetCountryName, targetCountryLatLng);

  /*

POUR QUAND L4API EST DOWN, AKA MAINTENANT


  await fetch(`${BASE_URL}/v3.1/all?fields=name,latlng`) // ne pas metre de ; car ça fait partie du mm truc
    .then((response) => response.json())

    .then((data) => {
      const random = Math.floor(Math.random() * data.length);

      targetCountry = data[random];
      targetCountryName = targetCountry.name.common;
      countryNameContainer.innerText = "Find : " + targetCountryName;
      targetCountryLatLng = targetCountry.latlng;

      console.log(targetCountryName, targetCountryLatLng);
    })

    .catch((error) => {
      console.warn(error);
    });
    */
};

const d = calculateDistance(
  clickedLat,
  clickedLng,
  targetCountryLat,
  targetCountryLng
);
//alert(d);

function calculateDistance(lat1Deg, lon1Deg, lat2Deg, lon2Deg) {
  function toRad(degree) {
    return (degree * Math.PI) / 180;
  }

  const lat1 = toRad(lat1Deg);
  const lon1 = toRad(lon1Deg);
  const lat2 = toRad(lat2Deg);
  const lon2 = toRad(lon2Deg);

  const { sin, cos, sqrt, atan2 } = Math;

  const R = 6371; // earth radius in km
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    sin(dLat / 2) * sin(dLat / 2) +
    cos(lat1) * cos(lat2) * sin(dLon / 2) * sin(dLon / 2);
  const c = 2 * atan2(sqrt(a), sqrt(1 - a));
  const d = R * c;
  console.log(d);
  return d; // distance in km
}

const onDomLoaded = () => {
  score = 0;

  //création de la map leafet

  let map = L.map("map").setView([51.505, 50], 3); // coordonnée latitude puis longitude de la position de départ avec après le niveau de zoom, on peut tt regler

  //injection/chargement des tuiles


  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



  getcountries();



  function onMapClick(e) {
    clickedLat = e.latlng.lat;
    clickedLng = e.latlng.lng;
    clickedLatLng = e.latlng;
    console.log(clickedLat, clickedLng);

    if (userMarker) {
      map.removeLayer(userMarker);
    }
    userMarker = L.marker(clickedLatLng).addTo(map);

    targetmarket = L.marker(targetCountryLatLng).addTo(map);

    let latlngsLine = [
      [clickedLat, clickedLng],
      [targetCountryLatLng[0], targetCountryLatLng[1]],
    ];
    if (polyline) {
      map.removeLayer(polyline);
    }

    polyline = L.polyline(latlngsLine, { color: "red" }).addTo(map);

    const d = calculateDistance(
      clickedLat,
      clickedLng,
      targetCountryLat,
      targetCountryLng
    );
    polyline
      .bindPopup(`vous êtes à ${Math.round(d)} km de la cible`)
      .openPopup();
    map.fitBounds(polyline.getBounds());

    // if distance en dessous de x, score en dépéndant.

    points = Math.round(300 * Math.exp(-d / 1500));
    pointsContainer.innerText = `+ ${points}`;
    console.log(points);
    score += points;
    scoreContainer.innerText = `Score : ${score}`;

    setTimeout(() => {
      console.log("Retardée de 3 secondes.");
      pointsContainer.innerText = "";
    }, 3000);
  }

  map.on("popupclose", function (e) {
    console.log("Popup fermé !");
    map.removeLayer(polyline);
    map.removeLayer(userMarker);
    map.removeLayer(targetmarket);
    getcountries();
  });

  map.on("click", onMapClick);
};

document.addEventListener("DOMContentLoaded", onDomLoaded);

/*
BASIQUE

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

}*/

/*

WATERCOLOR


L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
    minZoom: 1,
	maxZoom: 16,
   attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
}).addTo(map);
*/
