import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Image
} from 'react-native';

import { Container, Title, Content, Button, Text, Icon, Card, CardItem, Body } from 'native-base';

export default class TutorialScreen extends React.Component {
  static navigationOptions = {
    title: 'Tutoriel',
    headerStyle: {
      backgroundColor: '#335fe1'
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Container style={styles.container}>
        <StatusBar backgroundColor={'#335fe1'} />
        <Content>
          <Card style={{ flex: 0 }}>
            <CardItem>
              <Body>
                <Text>
                  Vous pouvez démarrer l'explication audio de la manière suivante:
                </Text>
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Image source={{ uri: 'tuto' }} style={{ width: 233, height: 396 }} />
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
});
