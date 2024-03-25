import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import React from "react";

const KeyboardAvoidingComponent = ({style, children}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={0}
      >
        <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.containerScrollView,style]}
        >
            {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default KeyboardAvoidingComponent;

const styles = StyleSheet.create({});
