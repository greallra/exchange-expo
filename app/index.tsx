import { useState, useEffect } from "react";
import { Text, View, ScrollView, Image } from "react-native";
import { Link, router, Redirect } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from '@/components/Loader'
import { images } from '@/constants'


export default function RootLayout() {
  const { loading, user } = useGlobalContext();
  // console.log('process.env.API_KEY', process.env.API_KEY);
  // console.log('process.env;', process.env);
  try {
    console.log('EXPO_PUBLIC_API_KEY', process.env.EXPO_PUBLIC_FB_API_KEY);
  } catch (error) {
    console.log(error);
    
  }


  if (user) {
    return <Redirect href="exchanges"/>
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
        {/* <Text>{JSON.stringify(user)}</Text> */}
        <Loader isLoading={loading} />
        <ScrollView contentContainerStyle={{height: '100%'}}>
          <View className="w-full items-center justify-center h-full pa-4">
            <Image 
            source={images.ronanLogo}
            // style={{height: 200}}
            resizeMode="contain"
            />
            <Link href="/profile" style={{color: 'red'}}>profile</Link>
            <Link href="/login" style={{color: 'red'}}>login</Link>
            <Link href="/exchanges" style={{color: 'red'}}>exchanges</Link>
            {/* <Button
              style={{margin: 2}}
              status='danger'
              onPress={() => router.push('/login')}
            >Button</Button>
            <Button
              style={{margin: 2}}
              status='danger'
              onPress={() => router.push('/exchanges')}
            >Exchanges</Button> */}
          </View>
        </ScrollView>

    </SafeAreaView>
  );
}
      {/*  <Text>ios {users.length}</Text>
      {users.map((user) => <Text>{user.name}</Text> )} */}

      // <Text className="text-3xl font-pblack">Exchanges</Text>

      // <Link href="/exchanges" style={{color: 'red'}}>exchanges</Link>
      // <Link href="/signup" style={{color: 'red'}}>login</Link>