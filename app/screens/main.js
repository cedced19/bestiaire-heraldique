import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Linking,
  Alert
} from 'react-native';

import { Container, Title, Content, Button, Text, Icon, Grid, Row, Footer, CheckBox, Body } from 'native-base';

export default class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Bestiaire héraldique',
    headerStyle: {
      backgroundColor: '#335fe1'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      accepted: false
    }
    this.acceptRules = this.acceptRules.bind(this);
  }

  openMap() {
    Linking.canOpenURL('http://maps.google.com/maps?daddr=48.743448,7.258147').then(supported => {
      if (supported) {
        Linking.openURL('http://maps.google.com/maps?daddr=48.743448,7.258147');
      }
    });
  };

  acceptRules() {
    if (this.state.accepted) {
      this.props.navigation.navigate('Walking');
    } else {
      Alert.alert(
        'Conditions d\'utilisation',
        'En appuyant sur ce bouton vous acceptez les conditions d\'utilisation évoquées sur cette page.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Oui',
            onPress: () => {
              this.props.navigation.navigate('Walking');
              this.setState({ accepted: true })
            }
          },
        ],
        { cancelable: true }
      )
    }
  }

  render() {
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
              <Button onPress={() => this.props.navigation.navigate('Tutorial')} style={{ backgroundColor: '#335fe1' }} iconRight>
                <Text>Tutoriel</Text>
                <Icon name='ios-book-outline' />
              </Button>
            </Row>
          </Grid>
          <Text style={styles.instructions}>La distance du parcours est de <Text style={{ fontWeight: 'bold' }}>5 km</Text>.{'\n'}</Text>
          <Text style={styles.instructions}>La marche est considérée comme un sport par conséquent assurez-vous d'avoir les conditions physiques nécessaires pour pouvoir la pratiquer.{'\n'}</Text>
          <Text style={styles.instructions}>L'association Découverto, ses auteurs et ses collaborateurs déclinent toutes responsabilités quant à l'utilisation, l'exactitude et la manipulation de l'application.{'\n'}</Text>
          <Text style={styles.instructions}>Nous vous rappelons que cette application pour smartphone peut à tout moment être victime d'une panne ou d'une déficience technique. Vous ne devez par conséquent pas avoir une foi aveugle en elle et nous vous conseillons de toujours vous munir d'une carte lorsque vous allez en forêt.</Text>
        </Content>
        <Footer style={{ backgroundColor: '#F5FCFF' }}>
          <Button onPress={this.acceptRules} style={{ backgroundColor: '#e74c3c' }} iconRight>
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
