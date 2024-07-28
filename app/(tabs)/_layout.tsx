import { StyleSheet, Text, View, Image, SafeAreaView, } from 'react-native'
import React from 'react'
import { useGlobalContext } from "@/context/GlobalProvider";
import { useRoute } from '@react-navigation/native';
import { Tabs, Redirect, Stack, route } from 'expo-router'
import { icons } from "@/constants"
import Header from '@/features/header/Header'
import { Input, Layout, Select, SelectItem, Datepicker, Icon, Text as KText } from '@ui-kitten/components';

const TabIcon = ({ icon, color, name, focused}) => {
    return (
        <SafeAreaView>
            <Image 
                source={icon}
                resizeMode='contain'
                tintColor={color}
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`}>{name}</Text>
        </SafeAreaView>
    )
}
const RenderIcon = ({ icon1, icon2, color, name, focused}): React.ReactElement => (
    <SafeAreaView style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Icon
                style={styles.icon} 
                name={icon1}
                fill={focused && '#8F9BB3'}
                animation="shake"
            />
            <Icon
                style={styles.icon}
                name={icon2}
                fill={focused && '#8F9BB3'}
            />
        </View>
        <KText status='basic' appearance={focused ? 'hint' : 'default'} style={{ marginTop: 0}}>{name}</KText>
    </SafeAreaView>
  
  );

const PrivateLayout = (props) => {
  const { loading, user } = useGlobalContext();
  const route = useRoute();

  if (!loading && !user) return <Redirect href="/login" />;

  return (
    <>
        <Header />
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                // tabBarActiveBackgroundColor: 'success',
                // tabBarInactiveBackgroundColor: 'danger',
                tabBarStyle: {
                    backgroundColor: '#F7F9FC',
                    borderTopWidth: 1,
                    // borderTopColor: 'danger',
                    height: 85
                }
            }}
        >
            <Tabs.Screen 
                name="exchanges/index"
                options={{
                    title: "Exchanges",
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <RenderIcon 
                            icon1="flag"
                            icon2="flag-outline"
                            color={icons.color}
                            name="Exchanges"
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
                    <RenderIcon 
                        icon1="edit-outline"
                        icon2="calendar"
                        color={icons.color}
                        name="Create Exchange"
                        focused={focused}
                    />
                    // <TabIcon 
                    //     icon={icons.profile}
                    //     color={icons.color}
                    //     name="Create Exchange"
                    //     focused={focused}
                    // />
                )
            }}
            />
            <Tabs.Screen 
            name="exchanges/edit/[id]"
            options={{
                title: "Edit Exchange",
                headerShown: false,
                href: null,
            }}
            />
            <Tabs.Screen 
            name="exchanges/view/[id]"
            options={{
                title: "View Exchange",
                headerShown: false,
                href: null
            }}
            />
       
        </Tabs>
    </>
  )
}

export default PrivateLayout

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
        padding: 0
      },
})