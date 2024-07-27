import { StyleSheet, View } from 'react-native'
import { useNavigation, NavigationState, useRoute } from '@react-navigation/native';
import { Text as Ktext, Avatar, Icon } from '@ui-kitten/components';
import React from 'react'
import { Link, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux'
import { images } from "@/constants"

const Header = ({headerType = 'default', headerTitle = 'Page Title' }: { headerType: string, headerTitle: string }) => {

    const activePage = useSelector((state) => {
        console.log(JSON.stringify(state, null, 2))
        return state.header.value.pageTitle
    })

    const defaultHeader = (
    <View style={styles.header}>
        <Ktext style={{ marginTop: 0 }}>
            
        </Ktext>
        <Ktext  category='s1' style={{ marginTop: 0 }}>{ activePage ? activePage : 'Page Title' }</Ktext>
        <Link href="/profile">
            <Avatar
                style={styles.avatar}
                size='small'
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
        <Ktext style={{ marginTop: 0 }}>{ headerTitle }</Ktext>
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
        height: 50,
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