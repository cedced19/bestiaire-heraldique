import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';

export default class App extends React.Component {
  render() {
    return (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.740569,
            longitude: 7.26325,
            latitudeDelta: 0.013585,
            longitudeDelta: 0.026264,
          }}
        />
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
