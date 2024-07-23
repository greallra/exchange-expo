import { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet } from "react-native";
import { Link, router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
// import { useHover } from '@mantine/hooks';
// import { Card, Image, Text, Badge, Button, Box, Group, Divider, Alert, Tooltip } from '@mantine/core';
// import { IconMapPin, IconClock, IconUsers, IconPencil, IconUserCheck, IconChecks, IconFlagPause, IconFlagFilled, IconFlag, 
//     IconBattery, IconBattery1, IconBattery2, IconBattery3, IconBattery4, IconPointer, IconBrain } from '@tabler/icons-react';

// import UserFlag from '@/components/UserFlag'
// import AvatarGroup from '../components/AvatarGroup'
import { images } from '@/constants'


interface ExchangeItemProps {
    id: string,
    name: string,
    location: Object,
    capacity: number,
    organizerId: string,
    organizerUnfolded: object,
    time: string,
    participantIds: Array,
    teachingLanguageId: string,
    learningLanguageId: string,
    learningLanguageUnfolded: object,
    teachingLanguageUnfolded: object,
    smallFlag: string,
    users: Array,
}

const cardCol = {
    marginRight: '20px', 
    whiteSpace: 'nowrap', 
    minWidth: '70px'
}

const ExchangeItem = (props: ExchangeItemProps) => {
    const [allParticipants, setAllParticipants] = useState([])
    const [participantsTeachingLanguage, setParticipantsTeachingLanguage] = useState([])
    const [participantsLearningLanguage, setParticipantsLearningLanguage] = useState([])
    const {  user } = useGlobalContext();
    // const { hovered, ref } = useHover();
    // const navigate = useNavigate();
    
    useEffect(() => {
        if (props.participantIds.length > 0 && props.users.length) {
            const allParticipants = props.users.filter( user => props.participantIds.includes(user.id));
            setAllParticipants(allParticipants)
        }
      }, [props.participantIds]);
    useEffect(() => {
        setParticipantsTeachingLanguage(allParticipants.filter( p => p.teachingLanguageId === props.teachingLanguageId))
        setParticipantsLearningLanguage(allParticipants.filter( p => p.teachingLanguageId === props.learningLanguageId))
      }, [allParticipants]);
      
    const isAttending = props.participantIds.includes(user.id);
    const isHost = props.organizerId === user.id;

    return (
        <Link style={styles.listItem} href="/exchanges/view/123">
            <View style={styles.leftCol}>
                <Image
                    source={require(`@/assets/images-flags/spanish.png`)}
                    style={styles.flag}
                /> 
           
                <Image
                     source={require("@/assets/images-flags/french.png")}
                     style={styles.flag}
                /> 
           
            </View>
            <View style={styles.middleCol}>
                <View><Text>Exchange at {props.name}</Text></View> 
           
            </View>
            <View style={styles.rightCol}>
                <View><Text>{props.time}</Text></View>
           
            </View>

            {/* <Text onPress={() => router.push('')}>test</Text> */}
        </Link>
    );
}
export default ExchangeItem

const styles = StyleSheet.create({
    listItem: {
      display: 'flex',
      flexDirection: 'row',
      padding: 10,
      backgroundColor: 'white'
    },
    leftCol: {
      display: 'flex',
      flexDirection: 'row',
      marginRight: 10
    },
    middleCol: {
      display: 'flex',
      flexDirection: 'row',
      margin: 10
    },
    rightCol: {
      display: 'flex',
      flexDirection: 'row',
      margin: 10
    },
    flag: {
        width: 20,
        height: 20,
    }
  });
  