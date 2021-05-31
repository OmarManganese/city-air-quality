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
let cityInput = document.getElementById("city-input");
let searchButton = document.getElementById("search-button");


async function getUserPositionAqi(){
  try{
    const response = await axios.get(`${aqicnBaseUrl}/feed/geo:${userLatitude};${userLongitude}/?token=${aqicnApiKey}`)
    return _.get(response, "data.data.aqi");
  } catch(error){
    console.log(error);
  }
}

function getCurrentPositionSuccess(pos){
  userLatitude = pos.coords.latitude;
  userLongitude = pos.coords.longitude;
}

function getCurrentPositionError(err) {
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


async function setUserPositionMessage(){
  navigator.geolocation.getCurrentPosition(getCurrentPositionSuccess, getCurrentPositionError);
  console.log(userLatitude);
  if(userLatitude && userLongitude){
    let userAqi = await getUserPositionAqi();
    userPositionMessage = `The air quality index at your position is ${userAqi}.`;  
  } else {
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
   let cityAqi = await getCityAqi();
   searchedCityMessage = `The air quality index at ${cityInput.value} is ${cityAqi}`;
 }







 
/*searchButton.onclick */
