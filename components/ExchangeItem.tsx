import { useState, useEffect } from 'react';
import { Text, View } from "react-native";
// import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "@/context/GlobalProvider";
// import { useHover } from '@mantine/hooks';
// import { Card, Image, Text, Badge, Button, Box, Group, Divider, Alert, Tooltip } from '@mantine/core';
// import { IconMapPin, IconClock, IconUsers, IconPencil, IconUserCheck, IconChecks, IconFlagPause, IconFlagFilled, IconFlag, 
//     IconBattery, IconBattery1, IconBattery2, IconBattery3, IconBattery4, IconPointer, IconBrain } from '@tabler/icons-react';

// import UserFlag from '@/components/UserFlag'
// import AvatarGroup from '../components/AvatarGroup'
// import images from '../assets/images';

import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import { ListItem, Separator, XStack, YGroup, Image } from 'tamagui'

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
        <YGroup.Item>
           <YGroup.Item>
                <ListItem hoverTheme>
                    <Text>{props.name}</Text>
                    <Image
                        source={{
                            uri: 'https://picsum.photos/200/300',
                            width: 80,
                            height: 60,
                        }}
                    /> 
                </ListItem>   

            </YGroup.Item>
        </YGroup.Item>
    );
}
export default ExchangeItem

            