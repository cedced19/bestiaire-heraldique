import React, { Component } from 'react';

import { Container, Content, Card, CardItem, Text, Body } from 'native-base';

export default class AboutMarker extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });
  constructor(props) {
    super(props);
  }
  componentWillMount () {
  }
  render() {

    return (
      <Container>
                <Content>
                    <Card style={{ flex: 0 }}>
                          <CardItem>
                            <Body>
                              <Text>Test</Text>
                            </Body>
                          </CardItem>
                     </Card>
                 </Content>
      </Container>
    );
  }
}
