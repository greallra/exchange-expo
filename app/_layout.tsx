import { Stack, Tabs, Slot, SplashScreen } from "expo-router";
import { Text, View } from "react-native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "@/context/GlobalProvider"
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text as KText, Button } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { TamaguiProvider } from 'tamagui'
import { createTamagui  } from '@tamagui/core'
import { config } from '@tamagui/config/v3'

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config)

// TypeScript types across all Tamagui APIs
type Conf = typeof tamaguiConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
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
  return (
    <GlobalProvider>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
      <TamaguiProvider config={tamaguiConfig}>
        {/* <Text>Root Layout</Text> */}
        <Stack>
            <Stack.Screen name="(private)" options={{ headerShown: false }} />
            {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
            <Stack.Screen name="(public)" options={{ headerShown: false }} />
           <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </TamaguiProvider>
      </ApplicationProvider>
    </GlobalProvider>
  );
}
