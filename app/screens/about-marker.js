import React, { Component } from 'react';

import { Container, Content, Card, CardItem, Text, Body, Button, H1, Grid, Row, Icon, Alert } from 'native-base';

import Sound from 'react-native-sound';

export default class AboutMarker extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      sound: false,
      duration: 0
    };
  }
  componentWillMount () {
    const sound = new Sound(this.props.navigation.state.params.sound, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return Alert.alert(
            'Erreur',
            'Une erreur a eu lieu lors de la lecture du fichier audio.',
            [{text: 'Ok'}]
        );
      }
      this.setState({ duration: Math.floor(sound.getDuration()) });
    });
    this.setState({sound})
  }


  _toggleAudio () {
    if (this.state.playing) {
      this.state.sound.pause();
    } else {
      this.state.sound.play((success) => {
        if (!success) {
          return Alert.alert(
              'Erreur',
              'Une erreur a eu lieu lors de la lecture du fichier audio.',
              [{text: 'Ok'}]
          )
        }
      });
    }

    this.setState({playing: !this.state.playing});
  }



  render() {
    return (
      <Container>
                <Content>
                    <Card style={{ flex: 0 }}>
                          <CardItem>
                              <Grid>
                                <Row>
                                  <H1>Explications audio</H1>
                                </Row>
                                <Row>
                                {(this.state.playing) ?  (
                                  <Button onPress={()=>this._toggleAudio()} iconRight>
                                      <Text>Pause </Text>
                                      <Icon name='pause' />
                                  </Button>
                                  ) : (
                                    <Button onPress={()=>this._toggleAudio()} iconRight>
                                      <Text>Play </Text>
                                      <Icon name='play' />
                                    </Button>
                                  )}
                                </Row>
                              </Grid>
                          </CardItem>
                     </Card>
                 </Content>
      </Container>
    );
  }
}
