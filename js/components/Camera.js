// jshint esversion:6
import React from "react";
import { StyleSheet, View } from "react-native";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import { navigate } from "../redux/render/render.action";
import { selectTourName } from "../redux/tour/tour.selectors";
import { selectUserId } from "../redux/user/user.selectors";
import { setTourName } from "../redux/tour/tour.action";
import {
  Container,
  Header,
  Content,
  Text,
  Left,
  Body,
  Right,
  Button
} from "native-base";
import axios from "axios";
const UseCamera = props => {
  const takePhoto = () => {
    let options = {
      storageOptions: {
        cameraRoll: true,
        skipBackup: true,
        path: "images"
      }
    };
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.uri };
        // alert(JSON.stringify(source));
        axios
          .get(
            `http://tourviewarserver.herokuapp.com/api/getpresignedurl/panoimages`
          )
          .then(results => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", results.data.presignedUrl);
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr);
                if (xhr.status === 200) {
                  // alert("Image successfully uploaded to S3");
                  props.setTourName;
                  axios
                    .post(`http://tourviewarserver.herokuapp.com/api/newtour`, {
                      id: results.data.id,
                      img_url: results.data.publicUrl,
                      tour_name: props.selectTourName,
                      // id_user: 1
                      id_user: props.selectUserId
                    })
                    .then(() => {
                      axios
                        .get(results.data.publicUrl)
                        .then(results => props.navigate("AR"));
                    })
                    .catch(err => alert(err));
                } else {
                  alert("Error while sending the image to S3");
                }
              }
            };
            xhr.setRequestHeader("Content-Type", "image/jpeg");
            xhr.send({
              uri: source.uri,
              type: "image/jpeg",
              name: "cameratest.jpg"
            });
          })
          .catch(err => alert(JSON.stringify(err)));
      }
    });
  };
  return (
    <Container style={{ width: 400, height: 700 }}>
      <Header>
        <Left>
          <Button
            hasText
            transparent
            onPress={() => {
              props.navigate("REACT_NATIVE_HOME");
            }}
          >
            <Text>Back</Text>
          </Button>
        </Left>
        <Body />
        <Right />
      </Header>
      <View style={styles.container}>
        <Text style={{ color: "#3FA4F0" }} onPress={takePhoto}>
          Take A Photo
        </Text>
      </View>
    </Container>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
const mapStateToProps = state => {
  return {
    selectTourName: selectTourName(state),
    selectUserId: selectUserId(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    navigate: render => dispatch(navigate(render)),
    setTourName: name => dispatch(setTourName(name))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(UseCamera);
