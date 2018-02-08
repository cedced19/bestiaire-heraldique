import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

export default class WalkingScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      userLocation: {},
      markers: [],
      itinerary: []
    };
   }

   componentWillMount () {
    const { navigate } = this.props.navigation;
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
       message: 'Vous devez activer la localisation pour que l\'application fonctionne.',
       ok: 'D\'accord',
       cancel: 'Annuler'
     }).then((success) => {
       BackgroundGeolocation.configure({
         desiredAccuracy: 0,
         stationaryRadius: 10,
         distanceFilter: 10,
         locationTimeout: 30,
         notificationTitle: 'Bestiaire héraldique',
         notificationText: 'Balade en cours...',
         startOnBoot: false,
         stopOnTerminate: false,
         locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
         interval: 5000,
         fastestInterval: 2500,
         activitiesInterval: 5000,
         stopOnStillActivity: false,
         notificationIconLarge: 'icon_location',
         notificationIconSmall: 'icon_location'
       });
       BackgroundGeolocation.on('location', (data) => {
         if (this.refs.walking) {
           let userLocation = { longitude: data.longitude, latitude: data.latitude };
           this.setState({ userLocation });
         }
       });
       BackgroundGeolocation.start();
     }).catch((error) => {
       navigate('Main');
     });
     const markers=require('../markers.json');
     const itinerary=require('../itinerary.json');
     this.setState({markers, itinerary})
  }

  componentWillUnmount() {
    BackgroundGeolocation.stop();
  }


  static navigationOptions = {
    title: 'Bestiaire héraldique',
    headerStyle: {
      backgroundColor: '#335fe1'
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
        <MapView
          style={{ ...StyleSheet.absoluteFillObject, left:0, right: 0, top:0, bottom: 0, position: 'absolute' }}
          initialRegion={{
            latitude: 48.741644,
            longitude: 7.264838,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsCompass={true}
          minZoomLevel={14}
          showsMyLocationButton={true}
          showsUserLocation={true}
          mapType={'terrain'}>
          <Polyline
        		coordinates={this.state.itinerary}
        		strokeColor='#000'
        		strokeWidth={3}
        	/>
          {this.state.markers.map(marker => (
            <Marker
              onCalloutPress={() => navigate('AboutMarker', marker)}
              description={'🎧'}
              coordinate={marker.coords}
              title={marker.title}
              key={marker.title}
            />
          ))}
        </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
