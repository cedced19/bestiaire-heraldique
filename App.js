import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainScreen from './app/screens/main.js';
import TutorialScreen from './app/screens/tutorial.js';
import WalkingScreen from './app/screens/walking.js';
import AboutMarkerScreen from './app/screens/about-marker.js';

export default App = StackNavigator({
  Main: { screen: MainScreen },
  Tutorial: { screen: TutorialScreen },
  Walking: { screen: WalkingScreen },
  AboutMarker: { screen: AboutMarkerScreen }
}, {
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#335fe1'
      },
      headerTintColor: 'white'
    }
  });
