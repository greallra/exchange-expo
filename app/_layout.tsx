import { Stack, Tabs, Slot, SplashScreen } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "@/context/GlobalProvider"
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text as KText, Button, Icon } from '@ui-kitten/components';
import { default as theme } from '@/kitten/custom-theme2.json';
import { default as mapping } from '@/kitten/mapping.json'; 
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ToastProvider } from 'react-native-toast-notifications'
import { Provider } from 'react-redux'
import store from '@/store/store.js'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  const SuccessIcon = <Icon
   
      fill='#8F9BB3'
      name='star'
    />

  return (
    <GlobalProvider>
       <Provider store={store}>
          <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} customMapping={mapping} theme={{...eva.light, ...theme}}>
                <ToastProvider
                  placement="top"
                  duration={5000}
                  animationType='slide-in'
                  animationDuration={250}
                  successColor="green"
                  dangerColor="red"
                  warningColor="orange"
                  successIcon={SuccessIcon}
                  normalColor="gray">
                  <Stack>
                      <Stack.Screen name="(public)" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
                      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
                      <Stack.Screen name="profile" options={{ headerShown: false, animation: 'slide_from_right' }} />
                      {/* <Stack.Screen name="settings" options={{ headerShown: false, animation: 'slide_from_right' }} /> */}
                      <Stack.Screen name="index" options={{ headerShown: false }} />
                  </Stack>
                </ToastProvider>
          </ApplicationProvider>
      </Provider>
    </GlobalProvider>
  );
}

const styles = StyleSheet.create({
  
});
