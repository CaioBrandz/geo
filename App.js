import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
Geolocation.setRNConfiguration(config);

export default function App() {
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [watchID, setWatchID] = useState(0);

  const callLocation = () =>{
    if(Platform.OS=== 'ios'){
      getLocation();
    } else{
      const requestLocationPermission = async () =>{
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACESS_FINE_LOCATION,
          {
            title:"permissao",
            message: "acesso a localização",
            buttonNeutral: "pergunte dps",
            buttonPositive:"ok",
            buttonNegative:"cancelar"
          }
        );
        if(granted === PermissionsAndroid.RESULTS.GRANTED){
          getLocation();
        } else {
          alert('Permissao negada');
        }
      };
      requestLocationPermission();
    }
  }

  const getLocation = () =>{
    Geolocation.getCurrentPosition(
      (position) => {
        const currentLatitude = JSON.stringify(position.coords.latitude);
        const currentLongitude = JSON.stringify(position.coords.longitude);
        setCurrentLatitude(currentLatitude);
        setCurrentLongitude(currentLongitude);
      },
      (error) => alert(error.message),
      { enableHighAccuracy:true,timeout:20000, maximumAge:1000}
    );
    const watchID = Geolocation.watchPosition((position) => {
      const currentLatitude = JSON.stringify(position.coords.latitude);
      const currentLongitude = JSON.stringify(position.coords.longitude);
      setCurrentLatitude(currentLatitude);
      setCurrentLongitude(currentLongitude);
    });
    setWatchID(watchID);
  }

  const clearLocation= () =>{
    Geolocation.clearWatch(watchID);
  }

  return (
    <View style={styles.container}>
      <Text>Latitude: {currentLatitude}</Text>
      <Text>Longitude: {currentLongitude}</Text>
      <View><Button title="obter" onPress={callLocation}/></View>
      <View><Button title="cancel" onPress={clearLocation}/></View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
