import _ from "lodash";
import axios from "axios";
import "./style.css";

const aqicnApiKey = process.env.AQICN_API_KEY;
const aqicnBaseUrl = "http://api.waqi.info";

let userLatitude;
let userLongitude;
let userPositionMessage;
let searchedCityMessage;

let userPositionAqiDiv = document.getElementById("user-position-aqi");
let searchedCityAqiDiv = document.getElementById("searched-city-aqi");
let searchedCityAqiForm = document.getElementById("searched-city-aqi-form");
let cityInput = document.getElementById("city-input");
let searchButton = document.getElementById("search-button");


function getCoordinates(){
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
}


async function getUserPosition(){
  try{
    let position = await getCoordinates();
    userLatitude = position.coords.latitude;
    userLongitude = position.coords.longitude;   
  } catch (err){
    switch(err.code) {
      case err.PERMISSION_DENIED:
        userPositionMessage = "User denied the request for Geolocation.";
        break;
      case err.POSITION_UNAVAILABLE:
        userPositionMessage = "Location information is unavailable.";
        break;
      case err.TIMEOUT:
        userPositionMessage = "The request to get user location timed out.";
        break;
      case err.UNKNOWN_ERROR:
        userPositionMessage = "An unknown error occurred.";
        break;
    }
  }
  
}

async function getUserPositionAqi(){
  try{
    const response = await axios.get(`${aqicnBaseUrl}/feed/geo:${userLatitude};${userLongitude}/?token=${aqicnApiKey}`)
    return _.get(response, "data.data.aqi");
  } catch(error){
    console.log(error);
  }
}

async function setUserPositionMessage(){
  await getUserPosition();
  let userAqi = await getUserPositionAqi();
  if(userAqi){
    userPositionMessage = `The air quality index at your position is ${userAqi}.`;  
  } else if(!userPositionMessage){
    userPositionMessage = "Data about the air quality index at your position is not available";
  }
}

async function createUserPositionMessageParagaph() {
  await setUserPositionMessage();
  let userPositionMessageParagraph = document.createElement("p");
  userPositionMessageParagraph.innerHTML = userPositionMessage;
  userPositionAqiDiv.appendChild(userPositionMessageParagraph);
}

createUserPositionMessageParagaph();


async function getCityAqi(){
  try{
    const response = await axios.get(`${aqicnBaseUrl}/feed/${cityInput.value}/?token=${aqicnApiKey}`)
    return _.get(response, "data.data.aqi");
  } catch(error){
    console.log(error);
  }
}
 async function setSearchedCityMessage(){
   let cityName = cityInput.value;
   if(!(cityName === "")){
     cityName = cityName[0].toUpperCase() + cityName.slice(1);
   }
   let cityAqi = await getCityAqi();
   if(cityAqi){
    searchedCityMessage = `The air quality index at ${cityName} is ${cityAqi}`;
   } else if(cityInput.value === ""){
    searchedCityMessage = "Type a city name in the input field above"
   } else if (!cityAqi === undefined){
     searchedCityMessage = `Data about the air quality index at ${cityInput.value} is not available`
   }  
 }

 async function createSearchedCityMessageParagaph(){
   await setSearchedCityMessage();
   let searchedCityMessageParagraph = document.createElement("p");
  searchedCityMessageParagraph.innerHTML = searchedCityMessage;
  searchedCityAqiDiv.appendChild(searchedCityMessageParagraph);
 }

 function replaceSubmit(){
   createSearchedCityMessageParagaph();
   return false;
 }

 searchedCityAqiForm.onsubmit = replaceSubmit;
 
