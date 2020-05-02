import React from "react";
import "./homepage.css";
import { Alert } from "react-bootstrap";

import Weather from '../components/weather/weather'
import FindCoordinates from "../components/findCoordinates/findCoordinates";
import SpotifyLogin from "../components/spotifyLogin/spotifyLogin";
import Slider from "../components/slider/slider"

export default class Homepage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        latitude: "",
        longitute: "",
        city: "",
        weather: "",
        displayLocationButton: true,
        displayLoginButton: false,
        displayLoginForm: false,
        displaySlider: false,
        showSuccess: false,         //if we should be showing success message after adding user
        showError: false,           //if we should be showing error message
        errorCode: 400,
        responseStatus: "nothing",  //the validation status of the email 
        errorMessage: ""            //the error message to display to the user after server rejects action
    };
  };

  searchWeather = async (position) => {
    // get weather from users location using latitude and longitude
    console.log("searchWeather");

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    this.setState({
      latitude: lat,
      longitude: lon
    });
    // save in local storage for future use
    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lon);

    let apiKey = "a4874b69f2735af868ede8a96278c415"
    let query = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    
    fetch(query, {
      method: 'GET',
      headers: 
      {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }}).then(res => {
        if(res.ok) {
          res.json().then(json => {
            console.log(json.weather);

            this.setState({
              weather: json.weather[0],
              city: json.name,
              displayLocationButton: false,
              displayLoginButton: true
            });
            
          });
        } else {
          console.log(query);
          console.log("error in fetching weather");
        }
      }
    );
  }

  findLocation = e => {
    // find location of user (latitude and longitude)
    e.preventDefault();
    console.log("findLocation");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.searchWeather);
    } else { 
      return(<Alert message="Geolocation is not supported by this browser." type="error" />);
    }
  }

  displayLoginForm = e => {
    // sends to a Spotify login page

    e.preventDefault();

    console.log("login");
    this.setState({
      displayLoginButton: false,
      displayLoginForm: true
    });
  }

  sendSpotifyData = () => {
    // sends data to spotify api

    console.log("sending data");
    this.setState({
      displayLoginForm: false,
      displaySlider: true
    });
  }

  sendDataToBackend = async (valence) => {
    // sends data to the back end
    
    valence = parseFloat(valence);
    valence = valence / 100;

    var data = {
      "valence": valence,
      "weatherID": this.state.weather.id
    }
    console.log(data);
   
    let query = "http://localhost:3300/main";
    
    fetch(query, {
      method: "POST",
      headers: 
      {
          "Accept": "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
      }).then(res => {
        if(res.ok) {
          // do something here if the response is ok
          console.log("response is ok");
        } else {
          console.log(query);
          console.log("error in fetching weather");
        }
      }
    );
  }

  render() {

    return (
      <>
        <FindCoordinates 
          display={this.state.displayLocationButton} 
          onClick={this.findLocation}
        />
        <Weather 
          city={this.state.city} 
          weather={this.state.weather.main} 
          description={this.state.weather.description} 
        />
        <SpotifyLogin 
          displayLoginButton={this.state.displayLoginButton}
          displayLoginForm={this.state.displayLoginForm}
          sendToForm={this.displayLoginForm}
          sendSpotifyData={this.sendSpotifyData}
        />
        <Slider
          displaySlider={this.state.displaySlider}
          parentCallback={this.sendDataToBackend}
        />
      </>
    );
  }
}
