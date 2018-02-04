import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';


export default class MainScreen extends React.Component {
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
        <Text style={styles.welcome}>
          Les bestiaires de Découverto: {'\n'} bestiaire héraldique
        </Text>
        <Text style={styles.instructions}>
          Suivez le circuit.
        </Text>
        <Button
          style={styles.button}
          onPress={() => navigate('Walking')}
          title="Démarrer"
          accessibilityLabel="Commencer le parcours"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    color: '#333333',
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#335fe1'
  }
});
