import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Linking
} from 'react-native';

import { Container, Title, Content, Button, Text, Icon, Grid, Row, Footer } from 'native-base';

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Bestiaire héraldique',
    headerStyle: {
      backgroundColor: '#335fe1'
    }
  };


  openMap() {
    Linking.canOpenURL('http://maps.google.com/maps?daddr=48.743448,7.258147').then(supported => {
      if (supported) {
        Linking.openURL('http://maps.google.com/maps?daddr=48.743448,7.258147');
      }
    });
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'#335fe1'} />
        <Content>
          <Text style={styles.welcome}>
            Les bestiaires de Découverto: {'\n'} bestiaire héraldique
         </Text>
          <Grid style={styles.center}>
            <Row style={styles.row}>
              <Text style={styles.instructions}>
                Suivez le circuit, si vous ne savez pas comment utiliser l'application veuillez consulter le tutoriel.
              </Text>
            </Row>
            <Row style={styles.row}>
              <Button onPress={this.openMap} style={{ backgroundColor: '#335fe1' }} iconRight>
                <Text>Aller au point de départ</Text>
                <Icon name='map' />
              </Button>
            </Row>
            <Row style={styles.row}>
              <Button onPress={() => navigate('Tutorial')} style={{ backgroundColor: '#335fe1' }} iconRight>
                <Text>Tutoriel</Text>
                <Icon name='ios-book-outline' />
              </Button>
            </Row>
          </Grid>
          <Text style={styles.instructions}>La distance du parcours est de <Text style={{ fontWeight: 'bold' }}>5 km</Text>.{'\n'}</Text>
          <Text style={styles.instructions}>La marche est considérée comme un sport par conséquent assurez-vous d'avoir les conditions physiques nécessaires pour pouvoir la pratiquer.{'\n'}</Text>
          <Text style={styles.instructions}>Nous vous rappelons que cette application pour smartphone peut à tout moment être victime d'une panne ou d'une déficience technique. Vous ne devez par conséquent pas avoir une foi aveugle en elle et nous vous conseillons de toujours vous munir d'une carte lorsque vous allez en forêt.{'\n'}</Text>
        </Content>
        <Footer style={{ backgroundColor: '#F5FCFF' }}>
          <Button onPress={() => navigate('Walking')} style={{ backgroundColor: '#e74c3c' }} iconRight>
            <Text>Démarrer</Text>
            <Icon name='ios-arrow-forward-outline' />
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    marginRight: 8
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    marginBottom: 8
  }
});
