import React, { useCallback, useEffect } from "react";
import { Text, BackHandler } from "react-native";
import { TextInput } from "react-native-paper";
import Navigation from "./src/components/navigation/Navigation";
import { UserProvider } from "./src/context/user.context";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import EStyleSheet from "react-native-extended-stylesheet";

export default function App() {
  EStyleSheet.build({ $textColor: "#0275d8" });
  if (Text.defaultProps == null) {
    Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
  }

  if (TextInput.defaultProps == null) {
    TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  SplashScreen.preventAutoHideAsync();
  const [fontsLoaded, fontError] = useFonts({
    roboto: require("./src/assets/fonts/Roboto-Regular.ttf"),
    pacifico: require("./src/assets/fonts/Pacifico-Regular.ttf"),
    sans: require("./src/assets/fonts/OpenSans-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  onLayoutRootView();

  return (
    <UserProvider>
      <Navigation />
    </UserProvider>
  );
}
