import React from 'react';
import { StyleSheet, View, Text, AppState, StatusBar, DeviceEventEmitter } from 'react-native';
import { Button, Icon } from 'native-base';
import MapView, { Polyline, Marker } from 'react-native-maps';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import KeepAwake from 'react-native-keep-awake';
import PushNotification from 'react-native-push-notification';
import getExtremums from 'get-extremums';

let allowStateUpdate = true;
let currentNotification = false;
let isForeground = true;

function distanceBtwPoint(position, reference) {
  var R = 6378.137;
  var dLat = reference.latitude * Math.PI / 180 - position.latitude * Math.PI / 180;
  var dLon = reference.longitude * Math.PI / 180 - position.longitude * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(position.latitude * Math.PI / 180) * Math.cos(reference.latitude * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return Math.floor(d * 1000);
}

export default class WalkingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: {},
      markers: [],
      itinerary: []
    };
    this._centerMap = this._centerMap.bind(this);
    this._nextMarker = this._nextMarker.bind(this);
    this._prevMarker = this._prevMarker.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.interval = setInterval(() => {
      if (allowStateUpdate) this.setState({ playing: global.playing, player: global.player });
    }, 1000);
  }

  componentWillMount() {
    allowStateUpdate = true;
    currentNotification = false;
    const markers = require('../markers.json');
    const itinerary = require('../itinerary.json');
    this.setState({ markers, itinerary });
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
        var list = [];
        this.state.markers.forEach((marker) => {
          list.push({
            d: distanceBtwPoint(data,marker.coords),
            title: marker.title
          });
        });
        var nearest = getExtremums(list, 'd').lowest;
        if (nearest.d <= 15) {
          if (currentNotification != nearest.title) {
            PushNotification.cancelAllLocalNotifications();
            var opts = {
              bigText: 'Nouvel extrait audio à écouter: ' + nearest.title,
              title: 'Nouvel extrait audio',
              message: nearest.title
            };
            if (isForeground) {
              opts.actions = '["Écoutez l\'extrait"]';
            }
            PushNotification.localNotification(opts);
            currentNotification = nearest.title;
          }
        } else {
          PushNotification.cancelAllLocalNotifications();
          currentNotification = false;
        }
      });
      BackgroundGeolocation.start();
    }).catch((error) => {
      navigate('Main');
    });
    PushNotification.registerNotificationActions(['Écoutez l\'extrait']);
    DeviceEventEmitter.addListener('notificationActionReceived', function(action){
      const info = JSON.parse(action.dataJSON);
      if (info.action == 'Écoutez l\'extrait') {
        for (var k in markers) {
          if (currentNotification == markers[k].title) {
            return navigate('AboutMarker', markers[k]);
          }
        }
      }
    });
    
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    BackgroundGeolocation.stop();
    clearInterval(this.interval);
    allowStateUpdate = false;
    if (global.playing) {
      global.player.pause();
      global.playing = false;
    }
  }

  _toggleAudio() {
    if (this.state.playing) {
      global.player.pause();
      if (allowStateUpdate) this.setState({ playing: false });
      global.playing = false;
    } else {
      if (allowStateUpdate) this.setState({ playing: true });
      global.playing = true;
      global.player.play((success) => {
        global.player.release();
        global.player = false;
        global.playing = false;
        if (allowStateUpdate) this.setState({ playing: false });

        if (!success) {
          global.currentMusic = false;
          return Alert.alert(
            'Erreur',
            'Une erreur a eu lieu lors de la lecture du fichier audio.',
            [{ text: 'Ok' }]
          );
        }
      });
    }
  }

  _centerMap() {
    this.refs.map.fitToCoordinates(
      [
        {
          latitude: 48.746399,
          longitude: 7.251178
        },
        {
          latitude: 48.734144,
          longitude: 7.28212
        }
      ], {
        edgePadding: { top: 10, right: 10, bottom: 10, left: 10 },
        animated: true,
      }
    );
  }

  _nextMarker() {
    for (var k in this.state.markers) {
      this.refs[this.state.markers[k].title].hideCallout();
    }
    if (typeof (this.currentMarker) == 'undefined') {
      this.currentMarker = 0;
    } else {
      if (this.currentMarker>=this.state.markers.length-1) {
        this.currentMarker=0;
      } else {
        this.currentMarker++;
      }
    }
    this.refs[this.state.markers[this.currentMarker].title].showCallout();
    this.refs.map.animateToCoordinate(this.state.markers[this.currentMarker].coords);
  };

  _prevMarker() {
    for (var k in this.state.markers) {
      this.refs[this.state.markers[k].title].hideCallout();
    }
    if (typeof (this.currentMarker) == 'undefined') {
      this.currentMarker = 0;
    } else {
      if (this.currentMarker==0) {
        this.currentMarker=this.state.markers.length-1;
      } else {
        this.currentMarker--;
      }
    }
    this.refs[this.state.markers[this.currentMarker].title].showCallout();
    this.refs.map.animateToCoordinate(this.state.markers[this.currentMarker].coords);
  };

  _handleAppStateChange(currentAppState) {
    if (currentAppState == 'background') {
      isForeground = false;
      if (global.playing) {
        global.player.pause();
        global.playing = false;
      }
    } else {
      isForeground = true;
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
        <StatusBar backgroundColor={'#335fe1'} />
        <KeepAwake />
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
          mapType={'terrain'}
          loadingEnabled={true}
          ref='map'>
          <Polyline
            coordinates={this.state.itinerary}
            strokeColor='#000'
            strokeWidth={3}
          />
          {this.state.markers.map(marker => (
            <Marker
              onCalloutPress={() => navigate('AboutMarker', marker)}
              coordinate={marker.coords}
              title={marker.title}
              ref={marker.title}
              key={marker.title}
            />
          ))}
        </MapView>
        <Button style={styles.button_next} onPress={() => this._nextMarker()}>
            <Icon name='ios-arrow-forward-outline' />
        </Button>
        <Button style={styles.button_prev} onPress={() => this._prevMarker()}>
            <Icon name='ios-arrow-back' />
        </Button>
        {(this.state.player) ? (
          <View>
            {(this.state.playing) ? (
              <Button onPress={() => this._toggleAudio()} style={styles.button_audio}>
                <Icon name='pause' />
              </Button>
            ) : (
                <Button onPress={() => this._toggleAudio()} style={styles.button_audio}>
                  <Icon name='play' />
                </Button>
              )}
          </View>
        ) : null}
        <Button style={styles.button_map} onPress={() => this._centerMap()}>
          <Text style={{ color: '#fff' }}>Recentrer</Text>
        </Button>
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
  button_audio: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    marginRight: 0,
    marginLeft: 0,
    zIndex: 10
  },
  button_map: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    marginRight: 0,
    marginLeft: 0,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 10
  },
  button_next: {
    position: 'absolute',
    right: 10,
    top: 10,
    marginRight: 0,
    marginLeft: 0,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 10
  },
  button_prev: {
    position: 'absolute',
    left: 10,
    top: 10,
    marginRight: 0,
    marginLeft: 0,
    paddingLeft: 10,
    paddingRight: 10,
    zIndex: 10
  }
});
