import { useState, useEffect, useCallback, useReducer } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { setActivePage } from '@/features/header/headerSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useLocalSearchParams, Link } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import { images } from '@/constants'
import { FIREBASE_DB } from '@/firebase/firebaseConfig';
// C
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Button, List, ListItem, Icon, Layout, Spinner, Text as KText, Divider, Avatar, Modal, Card,} from '@ui-kitten/components';
import { useToast } from "react-native-toast-notifications";
import AvatarItem from '@/components/AvatarItem'
import { safeImageParse } from '@/common/utils'
import { formatExchange , esGetDoc, esUpdateDoc, checkUserIsValidToJoin, safeParse, parseLocation, 
  addParticipantToExchange, removeMyselfFromExchange, getPartipantsOfLanguages, checkUserHasJoined } from 'exchanges-shared'
import useFetch from '@/hooks/useFetch';
import useFetchOne from '@/hooks/useFetchOne';
import useLanguages from '@/hooks/useLanguages';
import { useRoute } from '@react-navigation/native';
import GoogleMap from '@/components/GoogleMap.tsx'
import AddFriendsPopover from '@/components/AddFriendsPopover'
import AddFriendsAutoComplete from '@/components/AddFriendsAutoComplete'
import { KittenModal } from '@/components/KittenModal'
import LoadingButton from '@/components/LoadingButton'
import { validateFormForServer } from '@/services/formValidation'

export default function ViewExchange({ navigation }) {
  const [theKey, setTheKey] = useState(0);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const { id } = useLocalSearchParams();
  const { user: me } = useGlobalContext();
  const [amValidToJoin, setAmValidToJoin] = useState(false);
  const [haveJoined, setHaveJoined] = useState(false);
  const [notValidReason, setNotValidReason] = useState('');

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
  useFocusEffect(useCallback(() => { setTheKey(Math.random()); } , []))

  async function handleAddParticipant(user) {
      setIsLoading(true)
      const { isValid, message, joiningUser } = checkUserIsValidToJoin(exchange, participantsTeachingLanguage, participantsLearningLanguage, me, user)
      
      if (!isValid) {
        setIsLoading(false)
        toast.show(message, { type: 'error', placement: "top" });
        return;
      } 
      const { error, response } = await addParticipantToExchange(FIREBASE_DB, exchange, joiningUser)
      if (error) {
        setIsLoading(false)
        return toast.show(message, { type: 'error', placement: "top" });
      }
      await fetchData(id)
      setIsLoading(false)
  }

  async function handleRemoveMyself() {
    try {
      setIsLoading(true)
      const { success, message } = await removeMyselfFromExchange(FIREBASE_DB, me, exchange)
      if (!success) {
        setIsLoading(false)
        return toast.show(`Organizers cannot remove themselves from the exchange`, { type: 'error', placement: "top" });
      } 
      await fetchData(id)
      setIsLoading(false)
      toast.show(`You Have been removed from the Exchange`, { type: 'success', placement: "top" });
    } catch (error) {
      console.log(error);
      
      setIsLoading(false)
      toast.show(`Error removing you from the Exchange, ${error.message}`, { type: 'error', placement: "top" });
    }
  }

  async function fetchData(id:string) {  
    try {
      const {docSnap} = await esGetDoc(FIREBASE_DB, "exchanges", id);
      console.log('docSnap.data()', docSnap.data());
      console.log('languages', languages);
      console.log('users', users);
      try {
        const formattedExchange = formatExchange({...docSnap.data(), id: docSnap.id}, languages, users)
        console.log('formattedExchange', formattedExchange);
        
        setExchange(formattedExchange)
      } catch (error) {
        console.log('errrr', error);
        toast.show(`Error fetching exchanges`, { type: 'success', placement: "top" });
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    if (languages.length > 0) {
      fetchData(id)
    }
  }, [languages, users]); 
  useEffect(() => {
    fetchData(id)
  }, [id]); 
  
  useEffect(() => {
   
    if (exchangeListener && languages.length > 0 && users.length > 0) {
      const formattedExchange = formatExchange({...exchangeListener, id: exchangeListener.id}, languages, users)
      setExchange(formattedExchange)
    }

  }, [exchangeListener, id, languages]); 

  useEffect(() => {
    if (exchange && users.length > 0) {
      const { participantsTeachingLanguage, participantsLearningLanguage } = getPartipantsOfLanguages(users, exchange)
      setParticipantsTeachingLanguage(participantsTeachingLanguage);
      setParticipantsLearningLanguage(participantsLearningLanguage);
    }
  }, [exchange, users])

  useEffect(() => {
    if (exchange && me && participantsTeachingLanguage && participantsLearningLanguage) {
      const { isValid, message } = checkUserIsValidToJoin(exchange, participantsTeachingLanguage, participantsLearningLanguage, me);   
      setAmValidToJoin(isValid)
      setHaveJoined(checkUserHasJoined(me, exchange));
      setNotValidReason(message)
    }
  }, [participantsTeachingLanguage, participantsLearningLanguage])

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
let exchangeIsFull = false;
if (exchange) {
  exchangeIsFull = participantsTeachingLanguage.length === exchange.capacity / 2 && participantsLearningLanguage.length === exchange.capacity / 2
}

   return exchange ? (<ScrollView style={{marginBottom: 50}}>
    {!exchange.location && <Image
        source={images.map}
        style={{ backgroundColor: 'powderblue',  width: '100%',}}
    /> 
 }
    {exchange.location && 
      <GoogleMap location={exchange.location}/> 
    }
    {/* <Button onPress={forceUpdate}>
      Click me to refresh 
    </Button> */}
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
        {/* <AddFriendsPopover 
          visible={popoverVisible}
          setVisible={setPopoverVisible}
          loading={isLoading} 
          handleAddParticipant={handleAddParticipant} 
          exchange={exchange} /> */}
        <Button 
            onPress={() => setPopoverVisible(true)}>
            Add Friends
        </Button>
      </View>
      {popoverVisible && <KittenModal 
            title="Add Friends" 
            onclick={() => {}}
            visible={popoverVisible}
            isLoading={isLoading}
            setVisible={setPopoverVisible}
            >
          <AddFriendsAutoComplete 
          visible={popoverVisible}
          setVisible={setPopoverVisible}
          loading={isLoading} 
          handleAddParticipant={handleAddParticipant} 
          exchange={exchange} />
        </KittenModal>}
 
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
    {!isLoading && exchangeIsFull && <Button status='primary'  disabled>
      The Exchange is full :-(
    </Button>}
    {!isLoading && !exchangeIsFull && !amValidToJoin && !haveJoined && <Button status='primary'  disabled>
      {notValidReason}
    </Button> }
    {!isLoading && haveJoined && <Button status='danger'   onPress={handleRemoveMyself}>
      Remove myself
    </Button> }
    {!isLoading && amValidToJoin && !haveJoined && 
    <Button status="primary"    
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