import { StyleSheet, View } from 'react-native'
// import { H1, H2, H3, H4, H5, H6, Heading, XStack, YStack, ZStack, Avatar } from 'tamagui'
import { Text, Avatar, Icon } from '@ui-kitten/components';
import React from 'react'
import { Link, router } from 'expo-router';
import { images } from "@/constants"

const Header = ({ headerType = 'default', headerTitle = 'Page Title' }: { headerType: string, headerTitle: string }) => {

    const defaultHeader = (
    <View style={styles.header}>
        <Text style={{ marginTop: 0 }}>
    
        </Text>
        <Text style={{ marginTop: 0 }}>{ headerTitle }</Text>
        <Link href="/profile">
            <Avatar
                style={styles.avatar}
                size='tiny'
                source={images.profile}
            />
        </Link>
    </View>);
    const profileHeader = (
    <View style={styles.header}>
        <Link href="/exchanges">
            <Icon
                style={styles.icon}
                fill='#8F9BB3'
                name='arrow-circle-left'
            />
        </Link>
        <Text style={{ marginTop: 0 }}>{ headerTitle }</Text>
        <Link href="/profile">
            <Avatar
                style={styles.avatar}
                size='tiny'
                source={images.profile}
            />
        </Link>
    </View>);

  return (
    <View>
        {headerType === 'default' ? defaultHeader : profileHeader }
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    header: {
        display: 'flex', 
        padding: 10, 
        marginTop: 20, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',   
        borderBottomWidth: 1,    
        borderBottomColor: 'grey',
    },
    icon: {
        width: 32,
        height: 32,
      },
})