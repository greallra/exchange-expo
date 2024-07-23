import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useGlobalContext } from "@/context/GlobalProvider";
import { useRoute } from '@react-navigation/native';
import { Tabs, Redirect, Stack, route } from 'expo-router'
import { icons } from "@/constants"
import Header from '@/components/Header'

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

const PrivateLayout = (props) => {
  const { loading, user } = useGlobalContext();
  const route = useRoute();
console.log('route', route);

  function getHeaderTitle(): string {
    return route.params.screen
  }
  function getHeaderType(): string {
    return 'default';
  }


  if (!loading && !user) return <Redirect href="/login" />;

  return (
    <>
        <Header headerTitle={getHeaderTitle()} headerType={getHeaderType()}/>
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
                name="exchanges/index"
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
            name="exchanges/create/index"
            options={{
                title: "Create Exchange",
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.profile}
                        color={icons.color}
                        name="Create Exchange"
                        focused={focused}
                    />
                )
            }}
            />
            <Tabs.Screen 
            name="exchanges/edit/[id]"
            options={{
                title: "Edit Exchange",
                headerShown: false,
                href: null,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.profile}
                        color={icons.color}
                        name="Edit Exchange"
                        focused={focused}
                    />
                )
            }}
            />
            <Tabs.Screen 
            name="exchanges/view/[id]"
            options={{
                title: "View Exchange",
                headerShown: false,
                href: null,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.profile}
                        color={icons.color}
                        name="View Exchange"
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