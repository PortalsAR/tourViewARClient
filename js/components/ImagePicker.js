// jshint esversion:6
import React from "react";
import { StyleSheet, View } from "react-native";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import { navigate } from "../redux/render/render.action";
import { setTourId } from '../redux/tour/tour.action';
import { selectTourName, selectTourId } from '../redux/tour/tour.selectors';
import { selectPanoId, selectTourPanos } from '../redux/pano/pano.selectors';
import { selectUserId } from '../redux/user/user.selectors';
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

import axios from 'axios';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {}
    };
  }

  chooseFile() {

    const options = {};
    ImagePicker.launchImageLibrary(options, response => {

      if (this.props.forobject) {
          const source = { uri: response.uri };
          // alert(JSON.stringify(source));
          axios.get(`http://tourviewarserver.herokuapp.com/api/getpresignedurlforobject/arobjectimages`)
          .then(results => {
            const xhr = new XMLHttpRequest();
            xhr.open(
              "PUT", results.data.presignedUrl
            );
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr);
                if (xhr.status === 200) {
                  alert("Image successfully uploaded to S3");
                  axios.post(`http://tourviewarserver.herokuapp.com/api/object`, {
                    object_type: 'image',
                    object_value: results.data.publicUrl,
                    id_pano: this.props.selectPanoId
                  })
                  .then(results => {
                    axios.get(
                      `http://tourviewarserver.herokuapp.com/api/scenes/${this.props.selectTourId}`
                    ).then(results => this.props.selectTourPanos(results.data))
                    .then(() => this.props.navigate('EDIT_AR_PAGE'))
                    .catch(err => console.log(err));
                  })
                  .catch(err => alert(err));
                } else {
                  alert("Error while sending the image to S3");
                }
              }
            };
            xhr.setRequestHeader("Content-Type", "image/jpeg");
            xhr.send({ uri: source.uri, type: "image/jpeg", name: "cameratest.jpg" });
          })
          .catch(err => alert(JSON.stringify(err)));
      } else {
        const source = { uri: response.uri };
        // alert(JSON.stringify(source));
        axios.get(`http://tourviewarserver.herokuapp.com/api/getpresignedurl/panoimages`)
        .then(results => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "PUT", results.data.presignedUrl
          );
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              console.log(xhr.status);
              console.log(xhr);
              if (xhr.status === 200) {
                alert("Image successfully uploaded to S3");
                axios.post(`http://tourviewarserver.herokuapp.com/api/newtour`, {
                  id: results.data.id,
                  img_url: results.data.publicUrl,
                  tour_name: this.props.selectTourName,
                  id_user: this.props.selectUserId
                })
                .then(results => this.props.setTourId(results.data.tourid))
                .then(() => {
                  axios.get(`http://tourviewarserver.herokuapp.com/api/scenes/${this.props.selectTourId}`).
                  then(results => this.props.selectTourPanos(results.data))
                  .then(() => this.props.navigate('CREATE_AR_PAGE'))
                  .catch(err => console.log(err));
                })
                .catch(err => alert(err));
              } else {
                alert("Error while sending the image to S3");
              }
            }
          };
          xhr.setRequestHeader("Content-Type", "image/jpeg");
          xhr.send({ uri: source.uri, type: "image/jpeg", name: "pickertest.jpg" });
        })
        .catch(err => alert(JSON.stringify(err)));
      }
    });
  }

  render() {
    return (
      <Container style={{ width: 400, height: 700 }}>
        <Header>
          <Left>
            <Button
              hasText
              transparent
              onPress={() => {
                this.props.navigate("REACT_NATIVE_HOME");
              }}
            >
              <Text>Back</Text>
            </Button>
          </Left>
          <Body />
          <Right />
        </Header>

        <View style={styles.container}>
          <Text onPress={this.chooseFile} style={{ color: "#3fa4f0" }}>
            Choose File
          </Text>
        </View>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return {
    selectTourName: selectTourName(state),
    selectTourId: selectTourId(state),
    selectPanoId: selectPanoId(state),
    selectTourPanos: selectTourPanos(state),
    selectUserId: selectUserId(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    navigate: render => dispatch(navigate(render)),
    setTourId: id => dispatch(setTourId(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageUpload);
