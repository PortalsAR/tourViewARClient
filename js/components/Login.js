import React, { Component } from "react";

import axios from 'axios';

import {
  StyleSheet,
  View,
  TextInput,
  Image,
  AppRegistry,
  PixelRatio,
  TouchableHighlight
} from "react-native";

import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Title,
  Button,
  Text,
  Left,
  Body,
  Right
} from "native-base";

import { ViroVRSceneNavigator, ViroARSceneNavigator } from "react-viro";

import { connect } from "react-redux";

import { selectNavigator } from "../redux/render/render.selectors";

import { selectUserName, selectUserPassword } from "../redux/user/user.selectors";

import { navigate } from "../redux/render/render.action";

import { setUserName, setUserPassword } from "../redux/user/user.action";

import HomePage from "./Homepage";

import Signup from "./Signup";

import Profile from "./Profile";

import Search from "./Search";

import ImageUpload from "./ImagePicker";

import UseCamera from "./Camera";

var sharedProps = {
  apiKey: "API_KEY_HERE"
};

// Sets the default scene you want for AR and VR
var InitialARScene = require("../HelloWorldSceneAR.js");
// var InitialVRScene = require('./js/HelloWorldScene');

var UNSET = "UNSET";
var VR_NAVIGATOR_TYPE = "VR";
var AR_NAVIGATOR_TYPE = "AR";
var REACT_NATIVE_SIGNUP = "SIGNUP";
var REACT_NATIVE_HOME = "REACT_NATIVE_HOME";
var PROFILE = "PROFILE";
var IMAGE_UPLOAD = "IMAGE_UPLOAD";
var LOGIN_PAGE = "LOGIN_PAGE";
var CAMERA_PAGE = "CAMERA_PAGE";
var SEARCH_PAGE = "SEARCH_PAGE";

// This determines which type of experience to launch in, or UNSET, if the user should
// be presented with a choice of AR or VR. By default, we offer the user a choice.
var defaultNavigatorType = UNSET;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      navigatorType: defaultNavigatorType,
      sharedProps: sharedProps
    };
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._getReactNativeHome = this._getReactNativeHome.bind(this);
    this._getExperienceButtonOnPress = this._getExperienceButtonOnPress.bind(this);
    this._getProfilePage = this._getProfilePage.bind(this);
    this._getImageUpload = this._getImageUpload.bind(this);
    this._getSearchPage = this._getSearchPage.bind(this);
    this._exitViro = this._exitViro.bind(this);
    this._getUserLogin = this._getUserLogin.bind(this);
    this._loginHandler = this._loginHandler.bind(this);
  }
  render() {
    if (this.props.selectNavigator === LOGIN_PAGE) {
      return this._getExperienceSelector();
    } else if (this.props.selectNavigator === AR_NAVIGATOR_TYPE) {
      return this._getARNavigator();
    } else if (this.props.selectNavigator === REACT_NATIVE_HOME) {
      return this._getReactNativeHome();
    } else if (this.props.selectNavigator === REACT_NATIVE_SIGNUP) {
      return this._getReactNativeSignup();
    } else if (this.props.selectNavigator === PROFILE) {
      return this._getProfilePage();
    } else if (this.props.selectNavigator === IMAGE_UPLOAD) {
      return this._getImageUpload();
    } else if (this.props.selectNavigator === CAMERA_PAGE) {
      return this._getCameraPage();
    } else if (this.props.selectNavigator === SEARCH_PAGE) {
      return this._getSearchPage();
    }
  }

  _loginHandler() {}

  // Presents the user with a choice of an AR or VR experience
  _getExperienceSelector() {
    return (
      <Container style={{ width: 400, height: 700 }}>
        <Header>
          <Left />
          <Body>
            <Title>Tour AR</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../res/logo.png")}
              style={{ height: 200, width: 200 }}
            />
          </View>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Form
              style={{
                width: 250
              }}
            >
              <Item floatingLabel>
                <Label>Username</Label>
                <Input
                  onChangeText={text => {
                    this.props.setUserName(text);
                  }}
                />
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={text => {
                    this.props.setUserPassword(text);
                  }}
                />
              </Item>
            </Form>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Button
                block
                light
                style={{
                  margin: 20,
                  width: 250
                }}
                // onPress={this._loginHandler}
                onPress={this._getUserLogin}
              >
                <Text>Login</Text>
              </Button>
            </View>
          </View>
          <View style={styles.outer}>
            <Button
              block
              onPress={() => {
                this.props.navigate(REACT_NATIVE_HOME);
              }}
              style={{ marginBottom: 20 }}
            >
              <Text style={styles.buttonText}>HOMEPAGE</Text>
            </Button>

            <Button
              block
              onPress={() => {
                this.props.navigate(REACT_NATIVE_SIGNUP);
              }}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }

  // Returns the ViroARSceneNavigator which will start the AR experience
  _getARNavigator() {
    return (
      <ViroARSceneNavigator
        {...this.state.sharedProps}
        initialScene={{ scene: InitialARScene }}
      />
    );
  }

  _getReactNativeHome() {
    return <HomePage />;
  }

  _getReactNativeSignup() {
    return <Signup />;
  }

  _getProfilePage() {
    return <Profile />;
  }

  _getImageUpload() {
    return <ImageUpload />;
  }

  _getCameraPage() {
    return <UseCamera />;
  }

  _getSearchPage() {
    return <Search />;
  }

  _getUserLogin() {
    axios.get(`http://tourviewarserver.herokuapp.com/api/login`, {
      body: {
        username: selectUserName,
        pw: selectUserPassword
      }
    })
      .then((results) => alert(results))
      .catch((err) => alert('invalid username or password', err))
  }

  // This function returns an anonymous/lambda function to be used
  // by the experience selector buttons
  _getExperienceButtonOnPress(navigatorType) {
    return () => {
      this.setState({
        navigatorType: navigatorType
      });
    };
  }

  // This function "exits" Viro by setting the navigatorType to UNSET.
  _exitViro() {
    this.setState({
      navigatorType: UNSET
    });
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#68a0dd"
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  title: {
    color: "black",
    borderWidth: 1,
    borderColor: "#000",
    margin: 10
  },
  viroContainer: {
    // flex: 1,
    backgroundColor: "white"
  },
  outer: {
    // flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white"
  },
  homepage: {
    // flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#68a0cf"
  },
  titleText: {
    paddingTop: 30,
    paddingBottom: 20,
    color: "black",
    textAlign: "center",
    fontSize: 25
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15
  },
  buttons: {
    height: 60,
    width: 120,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },
  exitButton: {
    height: 50,
    width: 100,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#68a0cf",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    navigate: render => dispatch(navigate(render)),
    setUserName: name => dispatch(setUserName(name)),
    setUserPassword: password => dispatch(setUserPassword(password))
  };
};

const mapStateToProps = state => {
  return {
    selectNavigator: selectNavigator(state),
    selectUserName: selectUserName(state),
    selectUserPassword: selectUserPassword(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
