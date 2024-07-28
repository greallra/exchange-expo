import { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Link, router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
// import { useHover } from '@mantine/hooks';
// import { Card, Image, Text, Badge, Button, Box, Group, Divider, Alert, Tooltip } from '@mantine/core';
// import { IconMapPin, IconClock, IconUsers, IconPencil, IconUserCheck, IconChecks, IconFlagPause, IconFlagFilled, IconFlag, 
//     IconBattery, IconBattery1, IconBattery2, IconBattery3, IconBattery4, IconPointer, IconBrain } from '@tabler/icons-react';

// import UserFlag from '@/components/UserFlag'
// import AvatarGroup from '../components/AvatarGroup'
import { Card, Layout, Text as Ktext, Icon, Divider } from '@ui-kitten/components';
import { images } from '@/constants'
import { safeParse } from '@/common/utils'


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
      <Card>
        <TouchableOpacity key={props.id} style={styles.layoutContainer} onPress={() => router.push(`/exchanges/view/${props.id}`)}>
              <View style={styles.leftCol}>
                <View style={styles.icons}>
                  <Image
                      source={images[props.teachingLanguageUnfolded.name.toLowerCase()]}
                      style={[styles.flag, {marginRight: 7}]}
                  /> 
                  {/* <Ktext>-</Ktext> */}
                  <Image
                      source={images[props.learningLanguageUnfolded.name.toLowerCase()]}
                      style={styles.flag}
                  /> 
                </View>
                <View style={[styles.icons, styles.mt]}>
                  {/* <Icon
                      style={styles.icon}
                      fill='#8F9BB3'
                      name='people-outline'
                    /> */}
                   <Ktext numberOfLines={1} style={{ paddingLeft: 5,}} category='s2'>{participantsTeachingLanguage.length}/{props.capacity / 2}</Ktext>
                   <Ktext numberOfLines={1} style={{ paddingLeft: 18, }} category='s2'>{participantsLearningLanguage.length}/{props.capacity / 2}</Ktext>
                </View>
              </View>
              <View style={styles.middleCol}>
                  <View style={[styles.icons]}>
                    <Ktext numberOfLines={2} category='h6'>{safeParse('location', props.location)}</Ktext>
                    <Icon
                          style={styles.icon}
                          fill='#8F9BB3'
                          name='pin'
                        />
                  </View>

                  <Ktext numberOfLines={3}>{props.teachingLanguageUnfolded.name } to {props.learningLanguageUnfolded.name } language exchange of {props.capacity} people at {safeParse('location', props.location)}.</Ktext>
                  {/* <View style={styles.fr}>  
                    <Icon
                      style={styles.icon}
                      fill='#8F9BB3'
                      name='pricetags'
                    />
                    <Ktext numberOfLines={1}>{props.name}</Ktext>
                  </View> 
                  <View style={[styles.fr, styles.mt]}>
                    <Icon
                      style={styles.icon}
                      fill='#8F9BB3'
                      name='pin'
                    />
                    <Ktext numberOfLines={1}>{safeParse('geometry', props.geometry)}</Ktext></View>  */}
            
              </View>
              <View style={styles.rightCol}>
                  <Ktext>{props.time}</Ktext>
                  <View style={[styles.icons, styles.mt]}>
                    <Icon
                        style={styles.icon}
                        fill='#8F9BB3'
                        name='people-outline'
                      />
                    <Ktext numberOfLines={1} style={{ paddingLeft: 5}}>{props.participantIds.length} / {props.capacity}</Ktext>
                </View>
                  {/* <Ktext numberOfLines={1}>{safeParse('organizerUnfolded', props.organizerUnfolded)}</Ktext> */}
              </View>  
      </TouchableOpacity>
    </Card>
    );
}
export default ExchangeItem

const styles = StyleSheet.create({
  fr: {
    flexDirection: 'row',
  },
  mt: {
    marginTop: 5
  },
  link : {
    padding: 0,
    width: '100%',
  },
  layoutContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: 'white'
    },
    leftCol: {
      
      display: 'flex',
      // flexDirection: 'row',
      marginRight: 10
    },
    middleCol: {
      flex: 3,
      marginRight: 30
    },
    rightCol: {
      flex: 1,
      flexDirection: 'reverse',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      // margin: 10
    },
    icons: {
      display: 'flex',
      flexDirection: 'row',
    },
    icon: {
        width: 20,
        height: 20,
    },
    flag: {
        width: 30,
        height: 30,
    }
  });
  