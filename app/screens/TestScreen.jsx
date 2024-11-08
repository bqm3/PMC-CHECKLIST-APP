import React, { useState } from 'react';
import { View, Text, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Function to pick an image using expo-image-picker
  const pickImage = async () => {
    // Request permission to access the camera or gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera or gallery is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0]);
    }
  };

  // Function to upload the selected image to your API
  const uploadImage = async () => {
    if (!imageUri) {
      alert('Please select an image first!');
      return;
    }
  
    const formData = new FormData();
  
    if (imageUri.uri) {
      const file = {
        uri: Platform.OS === "android" ? imageUri.uri : imageUri.uri.replace("file://", ""),
        name: imageUri.fileName || `${Math.floor(Math.random() * 999999999)}.jpg`,
        type: "image/jpeg",
      };
  
      // Append file to FormData with 'file' as the field name
      formData.append("file", file);  // Changed 'Image' to 'file'
    } else {
      alert('Invalid image data');
      return;
    }
  
    setUploading(true);
  
    try {
      const response = await axios.post('http://192.168.1.6:6868/api/v2/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // Handle success response
      setUploadResult(response.data);
      alert('Upload successful');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Image Picker and Upload</Text>

      {/* Display picked image */}
      {imageUri && <Image source={{ uri: imageUri.uri }} style={{ width: 300, height: 300, marginBottom: 20 }} />}
      
      {/* Button to pick an image */}
      <Button title="Pick Image" onPress={pickImage} />
      
      {/* Upload button */}
      <Button title={uploading ? 'Uploading...' : 'Upload Image'} onPress={uploadImage} disabled={uploading} />
      
      {/* Display upload result */}
      {uploadResult && <Text style={{ marginTop: 20 }}>{JSON.stringify(uploadResult)}</Text>}
    </View>
  );
}
