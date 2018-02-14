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


  openMap () {
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
         <Text style={styles.instructions}>
           Suivez le circuit.
         </Text>
         <Grid style={styles.center}>
            <Row style={styles.row}>
              <Button onPress={this.openMap} style={{backgroundColor: '#335fe1'}} iconRight>
                <Text>Aller au point de départ</Text>
                <Icon name='map' />
              </Button>
            </Row>
            <Row style={styles.row}>
              <Button style={{backgroundColor: '#335fe1'}} iconRight>
                <Text>Tutoriel</Text>
                <Icon name='ios-book-outline' />
              </Button>
            </Row>
        </Grid>

       </Content>
       <Footer style={{backgroundColor: '#F5FCFF'}}>
         <Button onPress={()=>navigate('Walking')} style={{backgroundColor: '#e74c3c'}} iconRight>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    marginBottom: 8
  }
});
