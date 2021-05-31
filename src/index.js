import _ from "lodash";
import axios from "axios";
import "./style.css";

const aqicnApiKey = process.env.AQICN_API_KEY;
const aqicnBaseUrl = "https://aqicn.org";

let userLatitude;
let userLongitude;

function success(pos){
    userLatitude = pos.coords.latitude;
    userLongitude = pos.coords.longitude;
}

function error(err) {
    switch(err.code) {
      case err.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        break;
      case err.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break;
      case err.TIMEOUT:
        console.log("The request to get user location timed out.")
        break;
      case err.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break;
    }
  }

async function getUserPositionAQ(){
  try{
    const aq = await axios.get(`${aqicnBaseUrl}/feed/geo:${userLatitude};${userLongitude}/?token=${aqicnApiKey}`)
  } catch(error){
    console.log(error);
  }
}

async function getCityAQ(){
  try{
    const aq = await axios.get(`${aqicnBaseUrl}/feed/${city}/?token=${aqicnApiKey}`)
  } catch(error){

  }
}


const container = document.createElement("div");
container.setAttribute("id", "container");



navigator.geolocation.getCurrentPosition(success, error);