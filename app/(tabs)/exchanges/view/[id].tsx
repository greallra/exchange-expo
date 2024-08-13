import { useState, useEffect, useCallback, useReducer } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { setActivePage } from '@/features/header/headerSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useLocalSearchParams, Link } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import { images } from '@/constants'
// C
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Button, List, ListItem, Icon, Layout, Spinner, Text as KText, Divider, Avatar, Modal, Card,} from '@ui-kitten/components';
import { useToast } from "react-native-toast-notifications";
import AvatarItem from '@/components/AvatarItem'
import { formatExchange, safeParse, parseLocation, safeImageParse } from '@/common/utils'
import { getOneDoc, setOneDoc } from '@/firebase/apiCalls'
import useFetch from '@/hooks/useFetch';
import useFetchOne from '@/hooks/useFetchOne';
import useLanguages from '@/hooks/useLanguages';
import { useRoute } from '@react-navigation/native';
import GoogleMap from '@/components/GoogleMap.tsx'
import AddFriendsPopover from '@/components/AddFriendsPopover'
import LoadingButton from '@/components/LoadingButton'

export default function ViewExchange({ navigation }) {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const { id } = useLocalSearchParams();
  const { user: me } = useGlobalContext();

  const [isLoading, setIsLoading] = useState(false);
  const [exchange, setExchange] = useState(null);
  const { languages } = useLanguages();
  const { data: users } = useFetch('users')
  const { data: exchangeListener } = useFetchOne('exchanges', id)
  const [participantsTeachingLanguage, setParticipantsTeachingLanguage] = useState([])
  const [participantsLearningLanguage, setParticipantsLearningLanguage] = useState([])
  const toast = useToast();
  const route = useRoute();
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => { 
      dispatch(setActivePage({ activePage: `View ${exchange && exchange.name ? exchange.name: 'Exchange'}`, leftside: 'arrow'})) 
    }, [exchange])
  );

  let amValidToJoin = false;
  let haveJoined = false;
  if (exchange && exchange.participantIds) {
    haveJoined = exchange.participantIds.includes(me.id);
  }

  if (exchange && exchange.learningLanguageId && exchange && exchange.teachingLanguageId) {
    const learningLanguageValues = Object.values(exchange.learningLanguageUnfolded);
    const teachingLanguageValues = Object.values(exchange.teachingLanguageUnfolded);
    const combinedValues = [...learningLanguageValues, ...teachingLanguageValues];
    combinedValues.includes(me.learningLanguageId);
    combinedValues.includes(me.teachingLanguageId);
    
    // if i havent already joined
    // if they are both my target languages
    if (
        combinedValues.includes(me.learningLanguageId) && 
        combinedValues.includes(me.teachingLanguageId)) {
        amValidToJoin = true;
    }
  }
  
  async function handleAddParticipant(user) {
    setIsLoading(true)
    let joiningUser;
    let joiningUserIsMe = false;
    if (!user) {
      joiningUser = me
      joiningUserIsMe = true
    } else {
      joiningUser = user 
    }
    try {
      // already joined
      if (exchange.participantIds.includes(joiningUser.id)) {
        setIsLoading(false)
        toast.show(`User ${joiningUser.username} has already joined this exchange`, { type: 'error', placement: "top" });
        return;
      }
      // no language match
      if (participantsTeachingLanguage.length >= exchange.capacity / 2 && participantsTeachingLanguage[0].teachingLanguageId === joiningUser.teachingLanguageId ) {
        setIsLoading(false)
        toast.show(`The Exchange is full for ${exchange.teachingLanguageUnfolded.name} speakers`, { type: 'error', placement: "top" });
        return;
      }
      // participantsTeachingLanguage full
      if (participantsTeachingLanguage.length >= exchange.capacity / 2 && participantsTeachingLanguage[0].teachingLanguageId === joiningUser.teachingLanguageId ) {
        setIsLoading(false)
        toast.show(`The Exchange is full for ${exchange.teachingLanguageUnfolded.name} speakers`, { type: 'error', placement: "top" });
        return;
      }
        // participantsLearningLanguage full
      if (participantsLearningLanguage.length >= exchange.capacity / 2 && participantsLearningLanguage[0].learningLanguageId === joiningUser.learningLanguageId) {
        setIsLoading(false)
        toast.show(`The Exchange is full for ${exchange.learningLanguageUnfolded.name} speakers`, { type: 'error', placement: "top" });
        return;
      }
      let participantsUserAdded = [...exchange.participantIds, joiningUser.id]

      await setOneDoc('exchanges', id, {...exchange, participantIds: participantsUserAdded });
      // await fetchData(id)
      setIsLoading(false)
      toast.show(`${joiningUserIsMe ? 'You have' : `${user.username} has`} joined the exchaged`, { type: 'success', placement: "top" });
    } catch (error) {
      // dispatch(cancelLoading())
      setIsLoading(false)
      toast.show(`Error joining the Exchange, ${error.message}`, { type: 'error', placement: "top" });
    }
  }

  async function handleRemoveMyself() {
    try {
      if (me.id === exchange.organizerId) {
        return toast.show(`Organizers cannot remove themselves from the exchange`, { type: 'error', placement: "top" });
      }
      setIsLoading(true)
      let participantsMeRemoved = [...exchange.participantIds]
      participantsMeRemoved.splice(participantsMeRemoved.indexOf(me.id), 1)
      await setOneDoc('exchanges', id, {...exchange, participantIds: participantsMeRemoved});
      // await fetchData(id)
      setIsLoading(false)
      toast.show(`You Have been removed from the Exchange`, { type: 'success', placement: "top" });
    } catch (error) {
      setIsLoading(false)
      toast.show(`Error removing you from the Exchange, ${error.message}`, { type: 'error', placement: "top" });
    }
  }

  async function fetchData(id:string) {  
    try {
      const {docSnap} = await getOneDoc("exchanges", id);
      console.log('docSnap.data()', docSnap);
      try {
        const formattedExchange = formatExchange({...docSnap.data(), id: docSnap.id}, languages, users)
        console.log('formattedExchange', formattedExchange);
        
        setExchange(formattedExchange)
      } catch (error) {
        console.log('errrr', error);
        
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    if (languages.length > 0) {
      fetchData(id)
    }
  }, [languages]); 
  useEffect(() => {
    fetchData(id)
  }, [id]); 
  
  useEffect(() => {
   
    if (exchangeListener) {
      const formattedExchange = formatExchange({...exchangeListener, id: exchangeListener.id}, languages, users)
      setExchange(formattedExchange)
    }

  }, [exchangeListener, id, languages]); 

  useEffect(() => {
    if (exchange && users.length > 0) {
      try {
        const participantsTeachingLanguage = users.filter((user) => exchange.participantIds.includes(user.id) && user.teachingLanguageId === exchange.teachingLanguageId)
        const participantsLearningLanguage = users.filter((user) => exchange.participantIds.includes(user.id) && user.learningLanguageId === exchange.teachingLanguageId)
        setParticipantsTeachingLanguage(participantsTeachingLanguage);
        setParticipantsLearningLanguage(participantsLearningLanguage);
      } catch (error) {
        console.log(12, error, users);  
      }

    }

  }, [exchange, users])

  useEffect(() => {
    console.log('participantsLearningLanguage', participantsLearningLanguage);
    console.log('participantsTeachingLanguage', participantsTeachingLanguage);
    
  }, [participantsTeachingLanguage, participantsLearningLanguage]); 



  const participantsList = (participants, teachingLanguage) => {
    const divContainer = [];
    for (let i = 0; i < exchange.capacity / 2; i++) {
      divContainer.push(<AvatarItem 
        key={i} 
        user={participants[i]} 
        exchange={exchange} 
        amValidToJoin={amValidToJoin}
        teachingLanguage={teachingLanguage} />)
    }
    return <View onPress={() => setVisible(true)}>{divContainer}</View>;
  }

 console.log('exchange', exchange);
 console.log('users', users);
 console.log('amValidToJoin', amValidToJoin);
 console.log('haveJoined', haveJoined);

   return exchange ? (<ScrollView>
    {!exchange.location && <Image
        source={images.map}
        style={{ backgroundColor: 'powderblue',  width: '100%',}}
    /> 
 }
    {/* {exchange.location && 
      <GoogleMap location={exchange.location}/> 
    } */}
    <Button onPress={forceUpdate}>
      Click me to refresh
    </Button>

    <Layout style={styles.container} level='0'>
      <KText
        style={[styles.text, styles.white]}
        category='h6'
      >{exchange.teachingLanguageUnfolded.label} to {exchange.learningLanguageUnfolded.label} Language Exchange at {parseLocation(exchange.location)}</KText>
      <View style={styles.infoBoxSection}>
        <View style={styles.infoBox}>
          <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='pin'
          />
          <KText style={styles.text}>{parseLocation(exchange.location)}</KText>
        </View>
        <View style={styles.infoBox}>
          <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='calendar-outline'
          />
          <KText style={styles.text}>{exchange.timeUnix}</KText>
        </View>
        <View style={styles.infoBox}>
          <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='clock'
          />
          <KText style={styles.text}>{exchange.duration}</KText>
        </View>
        <View style={styles.infoBox}>
          <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='flag-outline'
          />
          <KText style={styles.text}>{exchange.teachingLanguageUnfolded.label}, {exchange.learningLanguageUnfolded.label}</KText>
        </View>
        <View style={styles.infoBox}>
          <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='person'
          />
          <KText style={styles.text}>{safeParse('organizerUnfolded', exchange.organizerUnfolded)} {exchange.organizerId === me.id && <KText appearance='hint'  category='p2'>(You are hosting)</KText>}</KText>
        </View>
        <View style={styles.infoBox}>
          <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='pricetags'
          />
          <KText style={styles.text}>{exchange.name}</KText>
        </View>
      </View>
      <View style={styles.detailsSection}>
        <KText style={styles.text}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit et molestiae ipsam dignissimos labore. Nostrum exercitationem excepturi voluptas, illum veritatis at animi eum non ad a dolor quos pariatur libero.</KText>
      </View>
      <Divider />
      <View style={[styles.fr, { marginVertical: 20}]}>
        <KText
          category='h6'
        >Who's Attending?</KText>
        <AddFriendsPopover loading={isLoading} handleAddParticipant={handleAddParticipant} exchange={exchange} />
      </View>
 
      <View style={styles.participantsContainer}>
        <View style={styles.participantsInnerContainer}>
            <View style={{padding: '30px'}}>
                <View style={styles.participantsColumnTitle}>
                  <Avatar source={safeImageParse('teachingLanguageUnfolded', exchange)} size='tiny' />
                  <KText category='label'>{ exchange.teachingLanguageUnfolded.name }: {participantsTeachingLanguage.length} / {exchange.capacity / 2}</KText>
                </View>
                <View style={styles.participantsColumnAvatars}>
                  {participantsList(participantsTeachingLanguage, exchange.teachingLanguageId)}
                </View>
            </View>
            <View style={{padding: '30px'}}>
                <View style={styles.participantsColumnTitle}>
                  <Avatar source={safeImageParse('learningLanguageUnfolded', exchange)}   size='tiny' />
                  <KText category='label'>{ exchange.learningLanguageUnfolded.name }: {participantsLearningLanguage.length} / {exchange.capacity / 2} </KText>
                </View>
                <View style={styles.participantsColumnAvatars}>
                    {participantsList(participantsLearningLanguage, exchange.learningLanguageId)}
                </View>
            </View>
        </View>            
    </View>
    {!amValidToJoin && <Button color="red" fullWidth mt="md" radius="md" disabled>
      Your Languages dont match this Exchange
    </Button> }
    {!isLoading && amValidToJoin && haveJoined && 
    <Button 
      onPress={handleRemoveMyself}>
      Remove myself
    </Button> }

    {!isLoading && amValidToJoin && !haveJoined && 
    <Button 
      disabled={haveJoined} 
      onPress={() => handleAddParticipant()}
      appearance='filled'>
      Join
    </Button> }
    {isLoading && <LoadingButton status="primary"/>}

    </Layout>
 

   </ScrollView>) : (<View style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner status='warning' /></View>)


}

const styles = StyleSheet.create({
  container: {
    padding: 5
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  white: {
    backgroundColor: 'white'
  },
  fr: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  infoBoxSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  infoBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    width: '50%'
  },
  icon: {
    margin: 6,
    width: 24,
    height: 24,
  },
  iconFlag: {
    marginLeft: -10,
    width: 24,
    height: 24,
  },
  detailsSection: {
    paddingVertical: 10
  },
  participantsInnerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-evenly',
  },
  participantsColumnTitle: {
    display: "flex",
    alignItems: 'center',
    marginBottom: 15
  },
  participantsColumnAvatars: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
  },
  modalContainer: {
    minHeight: 192,
    padding: 25
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});