import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { auth, db, storage, storageRef } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { TextInput } from "react-native-paper";
import { addDoc, collection } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

// const storage = getStorage();
// const storageRef = ref(storage);

const UploadScreen = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [picture, setPicture] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("this is Line30", result);

    if (!result.canceled) {
      // console.log("hello 99");
      //setImage(result.assets[0].uri);this is correct one, but I have to use wrong one make it work
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    //covert image into blob image
    const blobImage = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });
    //set metadata of image
    const metadata = {
      contentType: "image/jpeg",
    };
    console.log("this is Line56", blobImage);

    //upload image to firebase storage
    const storageRef = ref(storage, "Images/" + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setPicture(downloadURL);
        });
      }
    );
  };
  const uploadInfo = async () => {
    if (picture) {
      //Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "Images"), {
        Title: title,
        Picture: picture,
      }).then(() => {
        alert("Upload Success");
      });
      console.log("Dcoument written with ID: ", docRef.id);
    } else {
      alert("Please wait for image to uploading");
    }
  };
  console.log("image!!!!!", image);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/126/126467.png",
            }}
            style={{ width: 30, height: 30, marginRight: 10 }}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Add New Image</Text>
      <View style={{ width: 300, height: 200, marginTop: 10 }}>
        <TextInput
          label="Add Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
      </View>
      <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an Image</Text>
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
        )}
        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.uploadInfoButton} onPress={uploadInfo}>
        <Text style={styles.buttonText}>AddInfo to fs</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#cfeffd",
  },
  text: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadInfoButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    marginTop: 30,
    alignItems: "center",
    marginBottom: 50,
  },
});
