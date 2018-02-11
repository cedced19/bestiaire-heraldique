import React from 'react';
import { StyleSheet, View, Text, AppState } from 'react-native';
import { Button, Icon } from 'native-base';
import MapView, { Polyline, Marker } from 'react-native-maps';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

let allowStateUpdate = true;

export default class WalkingScreen extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      userLocation: {},
      markers: [],
      itinerary: []
    };
   }

   componentDidMount () {
     AppState.addEventListener('change', this._handleAppStateChange);
     this.interval = setInterval(() => {
       if (allowStateUpdate) this.setState({playing: global.playing, player: global.player});
     }, 1000);
   }

   componentWillMount () {
    allowStateUpdate = true
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
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackgroundGeolocation.stop();
    clearInterval(this.interval);
    allowStateUpdate = false;
  }

  _toggleAudio () {
    if (this.state.playing) {
      global.player.pause();
      if (allowStateUpdate) this.setState({playing: false});
      global.playing = false;
    } else {
        if (allowStateUpdate) this.setState({playing: true});
        global.playing = true;
        global.player.play((success) => {
            global.player.release();
            global.player = false;
            global.playing = false;
            if (allowStateUpdate) this.setState({playing: false});

            if (!success) {
                global.currentMusic = false;
                return Alert.alert(
                    'Erreur',
                    'Une erreur a eu lieu lors de la lecture du fichier audio.',
                    [{text: 'Ok'}]
                );
              }
        });
      }
  }

  _handleAppStateChange (currentAppState) {
    if(currentAppState == 'background' && global.playing) {
        global.player.pause();
        global.playing = false;
    }
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
        <View style={styles.container}>
          <MapView
            style={styles.map}
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
          {(this.state.player) ?  (
            <View>
            {(this.state.playing) ?  (
              <Button onPress={()=>this._toggleAudio()} style={styles.button}>
                <Icon name='pause' />
              </Button>
            ) : (
              <Button onPress={()=>this._toggleAudio()} style={styles.button}>
                <Icon name='play' />
              </Button>
            )}
            </View>
          ) : null}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'stretch'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    marginRight: 0,
    marginLeft: 0,
    zIndex: 10
  }
});
