import { StyleSheet, View } from 'react-native'
import { useNavigation, NavigationState, useRoute } from '@react-navigation/native';
import { Text as Ktext, Avatar, Icon, Layout } from '@ui-kitten/components';
import React from 'react'
import { Link, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux'
import { images } from "@/constants"

const Header = () => {
    const headerState = useSelector((state) => state.header.value);  
    console.log('headerState', JSON.stringify(headerState, null, 2))

    return (
    <Layout style={styles.header} level='1'>
        {headerState.leftside === 'arrow' ? <Link href="/exchanges">
            <Icon
                style={styles.icon}
                fill='#8F9BB3'
                name='arrow-circle-left'
            />
        </Link> : <Ktext style={{ marginTop: 0 }}></Ktext>}
        <Ktext  category='s1' style={{ marginTop: 0 }}>{ headerState.activePage ? headerState.activePage : 'Page Title' }</Ktext>
        <Link href="/profile">
            <Avatar
                style={styles.avatar}
                size='small'
                source={images.profile}
            />
        </Link>
    </Layout>);

}

export default Header

const styles = StyleSheet.create({
    header: {
        display: 'flex', 
        // height: 50,
        // padding: 10, 
        paddingHorizontal: 10, 
        paddingTop: 30, 
        paddingBottom: 20, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',   
        borderBottomWidth: 1,    
        borderBottomColor: 'lightgrey',
    },
    icon: {
        width: 32,
        height: 32,
      },
})