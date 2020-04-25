import React from "react";
import Routes from "../routes";
import "./homepage.css";
import { Link } from "react-router-dom";
import { Button, Form, Row, Col, Alert } from "react-bootstrap";

import Weather from '../components/weather/weather'
import FindCoordinates from "../components/findCoordinates/findCoordinates";

export default class Homepage extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        latitude: "",
        longitute: "",
        city: "",
        weather: "",
        locationButton: true,
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
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      }})
      .then(res => {
          if(res.ok) {
            res.json().then(json => {
              console.log(json.weather);
              this.setState({
                weather: json.weather[0],
                city: json.name,
                locationButton: false
              });
            });
          } else {
            console.log("error in fetching weather");
          }
      });
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

  render() {
    return (
      <>
        <Weather city={this.state.city} weather={this.state.weather.main} description={this.state.weather.description} />
        <FindCoordinates locationButton={this.state.locationButton} onClick={this.findLocation}/>
        

        
      </>
    );
  }
}
