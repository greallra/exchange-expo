import { useState, useEffect } from "react";
import { Text, View, ScrollView, Image, StyleSheet, Pressable } from "react-native";
import { Link, router, Redirect } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from '@/components/Loader'
import { images } from '@/constants'
import { Button } from '@ui-kitten/components';


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
  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  return (
    <SafeAreaView>
        <Loader isLoading={loading} />
        <Text>kjjds</Text>
        <ScrollView contentContainerStyle={{height: '100%'}}>
          <View style={styles.container}>
            <Image 
            source={images.ronanLogo}
            style={{height: '100%'}}
            resizeMode="contain"
            />
             {/* <Image
              style={styles.image}
              source={images.ronanLogo}
              placeholder={{ blurhash }}
              transition={1000}
            /> */}
            {/* <Link href="/profile" style={{color: 'red'}}>profile</Link> */}
           <View style={{position: 'absolute', display: 'flex', justifyContent: 'center'}}>
            <Link href="/login">
              <Button
                style={{margin: 2}}
                status='danger'
                onPress={() => router.push('/login')}
              >Login</Button>
              <Text>Or</Text>
            </Link>
            <Link href="/login">
              <Button
                style={{margin: 2}}
                status='danger'
                onPress={() => router.push('/login')}
              >Signup</Button>
            </Link>
            </View>
          </View>
        </ScrollView>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // flex: 1,
    // width: '50%',
    // backgroundColor: '#0553',
  },
});
