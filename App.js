import React from 'react';
import { StackNavigator } from 'react-navigation';
import MainScreen from './app/screens/main.js';
import WalkingScreen from './app/screens/walking.js';

export default App = StackNavigator({
  Main: {screen: MainScreen},
  Walking: {screen: WalkingScreen}
}, {
  navigationOptions: {
   headerStyle:  {
     backgroundColor: '#335fe1'
   },
   headerTintColor: 'white'
  }
});
