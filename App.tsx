import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';

import * as Location from 'expo-location';
type ICoordsProps = {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

interface ILocationProps {
  coords: ICoordsProps;
  timestamp: number;
}

export default function App() {
  const [location, setLocation] = useState({} as ILocationProps);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        // Metodo 1-
        // setErrorMsg("Permissão para acessar localização foi negada.");
        // setLoading(false);

        // Metodo 2 -
        throw new Error("Permissão para acessar localização foi negada.");
      }


      let location = await Location.getCurrentPositionAsync({});

      console.log(`${Platform.OS} ===> getCurrentLocation`)
      console.log(location)
      console.log(`${Platform.OS} ===> getCurrentLocation`)

      setLocation(location)
    } catch (error) {
      console.log(`${Platform.OS} ===> getCurrentLocation error`)
      console.log(error?.message)
      console.log(`${Platform.OS} ===> getCurrentLocation error`)
      setErrorMsg(error?.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshLocation() {
    getCurrentLocation();
  }

  useEffect(() => {
    getCurrentLocation()
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Obtendo sua localização...</Text>
      </View>
    )
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style='dark' />

        <Text style={styles.errorText}>{errorMsg}</Text>

        <TouchableOpacity style={styles.button} onPress={refreshLocation}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.coords?.latitude,
            longitude: location?.coords?.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          showsUserLocation
          showsMyLocationButton
          followsUserLocation
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
            title='Você está aqui!'
            description={`Lat: ${location?.coords?.latitude?.toFixed(4)}, Lng: ${location?.coords?.longitude?.toFixed(4)}`}
            pinColor='#ff0000'
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },

  // Erros
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
    padding: 20
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    textAlign: 'center',
    marginBottom: 20
  },

  // Botao
  button: {
    backgroundColor: "#0066cc",
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold'
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
    padding: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666"
  },
});
