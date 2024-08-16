import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { useNavigation, NavigationState, useRoute } from '@react-navigation/native';
import { Text as Ktext, Avatar, Icon, Layout } from '@ui-kitten/components';
import React from 'react'
import { Link, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux'
import { images } from "@/constants"
// context user not updating on porfile update
import { useGlobalContext } from "@/context/GlobalProvider";
import useAuth from "@/hooks/useAuth";
import useLanguages from '@/hooks/useLanguages';
import { safeImageParse } from '@/common/utils'

const Header = () => {
    const headerState = useSelector((state) => state.header.value);  
    const { user } = useGlobalContext();
    const { user: user2 } = useAuth();
    const { languages } = useLanguages();
    console.log('user header', user)
    console.log('user2 header', user2)

    function getUserAvatar() {
        return user2.gender === 0 ? images.maleAvatar : images.femaleAvatar
    }
    

    return (
    <Layout style={styles.header} level='2'>
        {headerState.leftside === 'arrow' ? <TouchableOpacity onPress={() => router.push('/exchanges')}>
            <Icon
                style={styles.icon}
                fill='#8F9BB3'
                name='arrow-circle-left'
        
            />
        </TouchableOpacity> : <Ktext style={{ marginTop: 0 }}></Ktext>}
        <Ktext  category='s1' style={{ marginTop: 0 }}>{ headerState.activePage ? headerState.activePage : 'Page Title' }</Ktext>
        {__DEV__ && <Ktext style={styles.userNameDev}>{user.username}</Ktext>}
        <Link href="/profile">
            {user2 &&
                <>
                
                <>
                    <Avatar source={safeImageParse('teachingLanguageUnfolded', user2)}   size='tiny' />
                    <Avatar
                        style={styles.avatar}
                        size='medium'
                        source={getUserAvatar()}
                    />
                    <Avatar source={safeImageParse('learningLanguageUnfolded', user2)}   size='tiny' />
                </>
                </>
            }
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
        paddingTop: 50, 
        paddingBottom: 20, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',   
        // borderBottomWidth: 1,    
        // borderBottomColor: 'lightgrey',
    },
    icon: {
        width: 52,
        height: 52,
      },
    avatarContainer: {
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'center',   
    },
    userNameDev: {
        // backgroundColor: 'green',
        width: 50,
        // height: '25%',
        right: 25,
        top: 25,
        position: 'absolute',
    }
})