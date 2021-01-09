/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as fp from 'fingerpose';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fec857',
    alignItems: 'center',
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  camera: {
    width: 700 / 2,
    height: 800 / 2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
    marginTop: 20,
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  transparentText: {
    color: '#ffffff',
    opacity: 0.7,
  },
  footer: {
    marginTop: 40,
  },
  poweredBy: {
    fontSize: 20,
    color: '#e69e34',
    marginBottom: 6,
  },
  tfLogo: {
    width: 125,
    height: 70,
  },
});

export default function ASLDetectionScreen() {
  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState(false);
  const [image, setImage] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [emoji, setEmoji] = useState(null);
  const [predictionFound, setPredictionFound] = useState(false);

  const emojis = { thumbs_up: '👍🏾 Approval!', victory: '✌🏾 Victory!' };

  const TensorCamera = cameraWithTensors(Camera);
  let requestAnimationFrameId = 0;

  useEffect(
    () => () => {
      cancelAnimationFrame(requestAnimationFrameId);
    },
    [requestAnimationFrameId],
  );

  async function go() {
    await tf.ready();
    setIsTfReady(true);
    const handModel = await handpose.load();
    setIsModelReady(true);
    setModel(handModel);
  }
  useEffect(() => {
    go();
  }, []);

  const loadNewTranslation = async () => {
    setEmoji(null);
    setPredictionFound(false);
    setModel(null);
    setIsModelReady(false);
    setIsTfReady(false);
    await go();
  };

  const getPrediction = async (tensor) => {
    if (!tensor || tensor === null) {
      return;
    }
    const prediction = await model.estimateHands(tensor, true);
    if (!prediction || prediction.length === 0) {
      return;
    }

    const GE = new fp.GestureEstimator([fp.Gestures.VictoryGesture, fp.Gestures.ThumbsUpGesture]);
    const gesture = await GE.estimate(prediction[0].landmarks, 4);
    console.warn(prediction);
    if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
      // console.log(gesture.gestures);

      const confidence = gesture.gestures.map((hand) => hand.confidence);
      const maxConfidence = confidence.indexOf(Math.max.apply(null, confidence));
      console.warn(gesture.gestures[maxConfidence].name);
      setEmoji(gesture.gestures[maxConfidence].name);
    }
    setPredictionFound(true);
  };

  function HandleImageTensorReady(images) {
    const loop = async () => {
      const nextImageTensor = await images.next().value;
      await getPrediction(nextImageTensor);
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    if (!predictionFound) loop();
  }

  const inputTensorWidth = 152;
  const inputTensorHeight = 200;
  const AUTORENDER = true;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={{ fontSize: 25, marginTop: 10, color: '#2E86ab' }}>Make a hand gesture to begin</Text>
      <TouchableOpacity style={styles.imageWrapper}>
        <TensorCamera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          zoom={0}
          cameraTextureHeight={1200}
          cameraTextureWidth={1600}
          resizeHeight={inputTensorHeight}
          resizeWidth={inputTensorWidth}
          resizeDepth={3}
          onReady={(images) => HandleImageTensorReady(images)}
          autorender={AUTORENDER}
        />
      </TouchableOpacity>
      <View>
        { emoji && (
          <View style={{ display: 'flex', justifyContent: 'center' }}>
            <Text style={{ fontSize: 25, color: '#2E86ab' }}>This hand gesture means...</Text>
            <Text style={{
              fontSize: 50, justifyContent: 'center', marginTop: 20, color: '#0f9535',
            }}
            >
              { emojis[emoji] }
            </Text>
            <TouchableOpacity
              onPress={loadNewTranslation}
              style={{
                margin: 30, backgroundColor: 'red', borderRadius: 20, justifyContent: 'center',
              }}
            >
              <Text style={{
                textAlign: 'center', fontSize: 25, margin: 10, color: 'white',
              }}
              >
                Detect More ASL
              </Text>
            </TouchableOpacity>
          </View>
        ) }
      </View>
    </View>
  );
}
