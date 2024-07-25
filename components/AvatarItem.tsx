// import { Avatar, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { exchange, user } from '@/common/types';
import { getUserInitials } from '@/common/utils'
import { Layout, Spinner, Text as KText, Divider, Avatar } from '@ui-kitten/components';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { icons, images } from '@/constants'

interface propsAvatarItem {
    user: user,
    exchange: exchange,
    amValidToJoin: boolean
}
// if user return user use return add avatar
export default function AvatarItem({ me, user, exchange, teachingLanguage, amValidToJoin } : propsAvatarItem ) {
    const [activeHoverId, setActiveHoverId] = useState('')
    
    // this is just for the hover state
    function handleMouseEnter(id:string) {
       if (!amValidToJoin) {
            return;
       }
       if (!id) {
        //  setActiveHoverId('vacant')
       } else {
        // setActiveHoverId(user.id)
        console.log('id of user hovered:', id);
       }
    }
    function handleMouseLeave(id:string) {
        if (!id) {
            // setActiveHoverId('')
        } else {
            // setActiveHoverId('')
            console.log('id of user hovered:', id);
        }
    }

    function joinExchange(params:type) {
        [
            "Bf16L6hm9KOGvb4FPxSE",
            "m53BHc4MFZhnYn3HyGBj",
            "p49GgsvjoTg9YXlojhcJ"
          ]
    }
    
    if (user) {
        return (<View style={styles.container} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Avatar source={user.avatar ? user.avatar : images.profile} size='large'/>
            <KText appearance='hint'>{user.username}</KText>
        </View>)
    }
    return <View style={styles.container} onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()} onClick={joinExchange}>
       <Avatar source={icons.plus} size='large'/>
       <View style={{opacity: 0}}><KText appearance='hint'>Free Slot</KText></View>
    </View>
}
const styles = StyleSheet.create({
    container: {
        padding: 5,
        display: 'flex',
        alignItems: 'center'
    }
})