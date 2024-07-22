import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from "@/context/GlobalProvider";
import { Tabs, Redirect } from 'expo-router'
import { Button } from '@ui-kitten/components';
import { icons } from "@/constants"


const TabIcon = ({ icon, color, name, focused}) => {
    return (
        <View className="items-center justify-center gap-2">
            <Image 
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-6 h-6"
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}>{name}</Text>
        </View>
    )
}

const PrivateLayout = () => {
    const { loading, user } = useGlobalContext();
  console.log('xxxx', loading, user);
  
  if (!loading && !user) return <Redirect href="/login" />;

  return (
    <>
        {/* <Text>Private Layout</Text> */}
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#FFA001',
                tabBarInactiveTintColor: 'green',
                tabBarStyle: {
                    backgroundColor: '#fdd7ea',
                    borderTopWidth: 1,
                    borderTopColor: 'black',
                    height: 83
                }
            }}
        >
            <Tabs.Screen 
                name="exchanges"
                options={{
                    title: "Exchanges",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={icons.color}
                            name="exchanges"
                            focused={focused}
                        />
                    )
                }}
            />
                <Tabs.Screen 
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.profile}
                            color={icons.color}
                            name="profile"
                            focused={focused}
                        />
                    )
                }}
            />
                <Tabs.Screen 
                name="settings"
                options={{
                    title: "Settings",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon 
                            icon={icons.home}
                            color={icons.color}
                            name="settings"
                            focused={focused}
                        />
                    )
                }}
            />
         
        </Tabs>
    </>
  )
}

export default PrivateLayout

const styles = StyleSheet.create({})