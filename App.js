import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import * as Location from "expo-location";
import styles from "./styles";

const API_KEY = "AIzaSyC6AElKyZr_cd9i65HIDALMOYnUicFe7eQ";
const URL = `https://maps.google.com/maps/api/geocode/json?key=${API_KEY}&latlng=`;

export default function App() {
  // Create a couple of stateful variables
  // Take a set of long and lat and grab the address from the googlemaps api
  const [address, setAddress] = useState("loading...");
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();

  // useEffect to get the location
  useEffect(() => {
    function setPosition({ coords: { latitude, longitude } }) {
      setLongitude(longitude);
      setLatitude(latitude);

      // Fetch the data from the googlemaps api
      fetch("${URL}${latitude},${longitude}")
        .then((resp) => resp.json())
        .then(({ results }) => {
          if (results.length > 0) {
            setAddress(results[0].formatted_address);
          }
        })
        .catch((error) => console.log(error.message));
    }

    // Create a watche to watch for our current location
    let watcher;
    //Create an async function without a name just to  get the location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync;
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      // Part of the location exp api to get the current position
      let location = await Location.getCurrentPositionAsync({});
      setPosition(location);

      // Watch the location
      watcher = await Location.watchPositionAsync(
        { accuracy: Location.LocationAccuracy.Highest },
        setPosition
      );
    })(); // The () allows us to run the async function immediately

    // Finally as the app is ran or we close the app we want to stop the watcher
    return () => {
      watcher?.remove();
    };
  }, []);

  // We want to grab the address, long and lat from the stateful variables and show them

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Address: {address}</Text>
      <Text style={styles.label}>Latitude: {latitude}</Text>
      <Text style={styles.label}>Longitude: {longitude}</Text>
    </View>
  );
}
