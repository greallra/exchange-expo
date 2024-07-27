// import { Text, View, Image, } from "react-native";
import { Tabs, router, Stack, Redirect } from 'expo-router'
import { icons } from "@/constants"
import { useGlobalContext } from "@/context/GlobalProvider";




export default function PublicLayout() {
  const { loading, user } = useGlobalContext();



  if (!loading && user) return <Redirect href="/exchanges" />;
 
  return (
    <>
        {/* <Text>Public Layout</Text> */}
        <Stack>
            <Stack.Screen
            name="login"
            options={{
                headerShown: false,
            }}
            />
            <Stack.Screen
            name="signup"
            options={{
                headerShown: false,
            }}
            />
        </Stack>
    </>
  );
}