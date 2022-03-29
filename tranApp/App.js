import React, {useEffect, useState} from 'react';

// Import required components
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// Import Image Picker
//import ImagePicker from 'react-native-image-picker';
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const App = () => {
  const [tran, setTran] = useState({});
  const [Etime, setEtime] = useState(0);
  const [Stime, setStime] = useState(0);
  // const [SEtime, setSEtime] = useState(0);
  const baseUrl = 'http://af7f-171-96-233-40.ngrok.io';

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        console.log('base64 -> ', response.assets[0].base64);
        console.log('uri -> ', response.assets[0].uri);
        console.log('width -> ', response.assets[0].width);
        console.log('height -> ', response.assets[0].height);
        console.log('fileSize -> ', response.assets[0].fileSize);
        console.log('type -> ', response.assets[0].type);
        console.log('fileName -> ', response.assets[0].fileName);

        RNFS.readFile(response.assets[0].uri, 'base64')
        .then(res =>{
        fetch(`${baseUrl}/learn`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'picture' : res
        })
      });
      });

      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      console.log('base64 -> ', response.assets[0].base64);
      console.log('uri -> ', response.assets[0].uri);
      console.log('width -> ', response.assets[0].width);
      console.log('height -> ', response.assets[0].height);
      console.log('fileSize -> ', response.assets[0].fileSize);
      console.log('type -> ', response.assets[0].type);
      console.log('fileName -> ', response.assets[0].fileName);
      setStime(performance.now())

      // console.log('startTime -> ',('0'+new Date().getHours()).slice(-2) + ':' +('0'+new Date().getMinutes()).slice(-2) + ':' + ('0'+new Date().getSeconds()).slice(-2));
      // setStime(('0'+new Date().getHours()).slice(-2) + ':' +('0'+new Date().getMinutes()).slice(-2) + ':' + ('0'+new Date().getSeconds()).slice(-2));
      //console.log('Stime! -> ',Stime);

      RNFS.readFile(response.assets[0].uri, 'base64')
      .then(res =>{
        fetch(`${baseUrl}/learn`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'picture' : res
        })
        });
      
      });
    });
  };

  const getTran = () => {

    fetch(`${baseUrl}/learn`, {
      method: "GET",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        setTran(response)
      })
      const t1 = performance.now();
      console.log(`start to end use ${t1 - Stime} milliseconds.`);
      // setEtime(('0'+new Date().getHours()).slice(-2) + ':' +('0'+new Date().getMinutes()).slice(-2) + ':' + ('0'+new Date().getSeconds()).slice(-2));
      // console.log('endTime -> ',('0'+new Date().getHours()).slice(-2) + ':' +('0'+new Date().getMinutes()).slice(-2) + ':' + ('0'+new Date().getSeconds()).slice(-2))
      //console.log('endTime! -> ',Etime)
      
    }

    // useEffect(() => {
    //   console.log("The value after update", Etime);
    //   // console.log("The value after update", Stime);
    //   //startToEndTime();
    // }, [Etime])

  // const startToEndTime = () => {
  //   const SH = ((parseInt(Stime.charAt(0))*10)+(parseInt(Stime.charAt(1))))*3600
  //   const SM = ((parseInt(Stime.charAt(3))*10)+(parseInt(Stime.charAt(4))))*60
  //   const SS = (parseInt(Stime.charAt(6))*10)+(parseInt(Stime.charAt(7)))
  //   const EH = ((parseInt(Stime.charAt(0))*10)+(parseInt(Stime.charAt(1))))*3600
  //   const EM = ((parseInt(Stime.charAt(3))*10)+(parseInt(Stime.charAt(4))))*60
  //   const ES = (parseInt(Etime.charAt(6))*10)+(parseInt(Etime.charAt(7)))
    
  //   setSEtime(String(EH+EM+ES-SH-SM-SS))
  //   console.log('SEtime -> ',String(EH+EM+ES-SH-SM-SS))
  //   console.log('Stime -> ',Stime)
  //   console.log('Etime -> ',Etime)
  // }

//   useEffect(() => {
//     startToEndTime();
//  }, [])

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.titleText}>
        Picture To Translate
      </Text>
      <View style={styles.container}>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}>
          <Text style={styles.textStyle}>
            Launch Camera for Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile('photo')}>
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => getTran()}>
          <Text style={styles.textStyle}>start</Text>
        </TouchableOpacity>
        <Text style={styles.textStyle}>{`${tran.word}`}</Text>
        <Text style={styles.textStyle}>{`${tran.translate}`}</Text>
        
      </View>
    </SafeAreaView>
    
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginVertical: 10,
    width: 250,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
});