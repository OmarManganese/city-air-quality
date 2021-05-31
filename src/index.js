import _ from "lodash";
import axios from "axios";
import "./style.css";

const aqicnApiKey = process.env.AQICN_API_KEY;
const aqicnBaseUrl = "http://api.waqi.info";

let userLatitude;
let userLongitude;
let userPositionMessage;
let searchedCityMessage;

function success(pos){
    userLatitude = pos.coords.latitude;
    userLongitude = pos.coords.longitude;
}

function error(err) {
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

async function getUserPositionAqi(){
  try{
    const response = await axios.get(`${aqicnBaseUrl}/feed/geo:${userLatitude};${userLongitude}/?token=${aqicnApiKey}`)
    console.log(response);
    let userAqi = _.get(response, "data.data.aqi");
    console.log(userAqi);
  } catch(error){
    console.log(error);
  }
}

async function getCityAqi(){
  try{
    const response = await axios.get(`${aqicnBaseUrl}/feed/${city}/?token=${aqicnApiKey}`)
    console.log(response);
  } catch(error){
    console.log(error);
  }
}


navigator.geolocation.getCurrentPosition(success, error);

if(userLatitude && userLongitude){
  getUserPositionAqi();
} else {
  userLatitude = 10.3;
  userLongitude = 20.7;
  getUserPositionAqi();
}