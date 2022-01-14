import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import Tflite from 'tflite-react-native';

let tflite = new Tflite();
var modelFile = '<modelo>';
var labelsFile = '<labels>';

export default class App extends Component {
  //Component permite que o codigo execute tanto para Android e IOS
  constructor(props) {
    super(props);
    this.state = {
      recognition: null,
      source: null,
    };
    tflite.loadModel({model: modelFile, labels: labelsFile}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }

  selectGalleryImage() {
    const options = {};
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image');
      } else if (response.error) {
        console.log('Error');
      } else if (response.customButton) {
        console.log('User pressed custom buttom');
      } else {
        this.setState({
          source: {uri: response.uri},
        });
        tflite.runModelOnImage(
          {
            path: response.path,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(res[res.length - 1]); //imprime apenas o dicionario, nao a lista
              this.setState({recognitions: res[res.length - 1]});
            }
          },
        );
      }
    });
  }

  takeImage() {
    const options = {};
    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image');
      } else if (response.error) {
        console.log('Error');
      } else if (response.customButton) {
        console.log('User pressed custom buttom');
      } else {
        this.setState({
          source: {uri: response.uri},
        });
        tflite.runModelOnImage(
          {
            path: response.path,
            imageMean: 128,
            imageStd: 128,
            numResults: 2,
            threshold: 0.05,
          },
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(res[res.length - 1]); //imprime apenas o dicionario, nao a lista
              this.setState({recognitions: res[res.length - 1]});
            }
          },
        );
      }
    });
  }

  render() {
    const {recognitions, source} = this.state;
    return (
      <SafeAreaProvider>
        <LinearGradient
          colors={['#4949FF', '#BFBFFF']}
          style={styles.linearGradient}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>ExpirAI</Text>
            <Text style={styles.subtitle}>Analisador de Imagens</Text>
          </View>
          <View style={styles.outputContainer}>
            {recognitions ? (
              <View>
                <Image source={source} style={styles.pulmaoImage}></Image>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    paddingTop: 10,
                    fontSize: 25,
                  }}>
                  {recognitions['label'] +
                    ' - ' +
                    (recognitions['confidence'] * 100).toFixed(0) +
                    '%'}
                </Text>
              </View>
            ) : (
              <Image
                source={require('./assets/pulmao.png')}
                style={styles.pulmaoImage}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Galeria"
              titleStyle={{fontSize: 20}}
              containerStyle={{margin: 5}}
              buttonStyle={styles.button}
              onPress={this.selectGalleryImage.bind(this)}
            />
            <Button
              title="Foto"
              titleStyle={{fontSize: 20}}
              containerStyle={{margin: 5}}
              buttonStyle={styles.button}
              onPress={this.takeImage.bind(this)}
            />
          </View>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 70,
    marginLeft: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
  outputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 57,
    backgroundColor: 'black',
    borderRadius: 8,
  },
  pulmaoImage: {
    width: 250,
    height: 250,
  },
});
