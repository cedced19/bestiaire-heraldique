import React, { Component } from 'react';

import { AppState, StatusBar } from 'react-native';

import { Container, Content, Card, CardItem, Text, Body, Button, H1, Grid, Row, Icon, Alert } from 'native-base';

import Sound from 'react-native-sound';

let allowStateUpdate = true;

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
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentWillMount () {
    allowStateUpdate = true;
    if (global.currentMusic == this.props.navigation.state.params.sound) {
      this.setState({playing: global.playing});
    }
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount () {
    allowStateUpdate = false;
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _toggleAudio () {
    if (this.state.playing) {
      global.player.pause();
      this.setState({playing: false});
      global.playing = false;
    } else {
      if (global.currentMusic == this.props.navigation.state.params.sound && !global.playing && global.player) {
          this.setState({playing: true});
          global.playing = true;
          global.player.play((success) => {
              global.player.release();
              global.player = false;
              global.playing = false;
              if (allowStateUpdate) this.setState({playing: false});

              if (!success) {
                global.currentMusic = false;
                return Alert.alert(
                    'Erreur',
                    'Une erreur a eu lieu lors de la lecture du fichier audio.',
                    [{text: 'Ok'}]
                );
              }
          });
      } else {
        if(global.playing) {
          global.player.pause();
          global.player.release();
          global.player = false;
          global.playing = false;
        }
        global.currentMusic = this.props.navigation.state.params.sound;
        global.player = new Sound(this.props.navigation.state.params.sound, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            global.player = false;
            global.currentMusic = false;
            global.playing = false;
            return Alert.alert(
                'Erreur',
                'Une erreur a eu lieu lors de la lecture du fichier audio.',
                [{text: 'Ok'}]
            );
          }
          this.setState({ duration: Math.floor(global.player.getDuration()), playing: true });
          global.playing = true;
          global.player.play((success) => {
              global.player.release();
              global.player = false;
              global.playing = false;
              if (allowStateUpdate) this.setState({playing: false});

              if (!success) {
                global.player = false;
                global.playing = false;
                global.currentMusic = false;
                return Alert.alert(
                    'Erreur',
                    'Une erreur a eu lieu lors de la lecture du fichier audio.',
                    [{text: 'Ok'}]
                )
              }
          });
        });
      }
    }
  }

  _handleAppStateChange (currentAppState) {
    if(currentAppState == 'background' && global.playing) {
        global.player.pause();
        global.playing = false;
    }
    if(currentAppState == 'active' && global.currentMusic == this.props.navigation.state.params.sound) {
        this.setState({playing: global.playing});
    }
  }

  render() {
    return (
      <Container>
                <StatusBar backgroundColor={'#335fe1'} />
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
