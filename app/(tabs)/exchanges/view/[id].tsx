import { useState, useEffect } from 'react';
import { useLocalSearchParams, Link } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import { images } from '@/constants'
// C
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Button, List, ListItem, Icon } from '@ui-kitten/components';
// import { notifications } from '@mantine/notifications';
import AvatarItem from '@/components/AvatarItem'
import { formatExchange } from '@/common/utils'
import { getOneDoc, updateDoc } from '@/firebase/apiCalls'
import useFetch from '@/hooks/useFetch';
import useLanguages from '@/hooks/useLanguages';
import { Layout, Spinner, Text as KText, Divider, Avatar } from '@ui-kitten/components';
// import MapPosition from '@/components/Maps/MapPosition'

export default function ViewExchange() {
  const { id } = useLocalSearchParams();
  const { user: me } = useGlobalContext();

  const [exchange, setExchange] = useState(null);
  const { languages } = useLanguages();
  const { data: users } = useFetch('users')
  const [participantsTeachingLanguage, setParticipantsTeachingLanguage] = useState([])
  const [participantsLearningLanguage, setParticipantsLearningLanguage] = useState([])
  // const {user: me} = useAuth()

  // let params = useParams();

  // const isLoading = useSelector((state) => state.loading.value)
  // const dispatch = useDispatch()

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
  async function handleJoin() {
    // dispatch(setLoading())
    try {
      if (participantsTeachingLanguage.length >= exchange.capacity / 2 && participantsTeachingLanguage[0].teachingLanguageId === me.teachingLanguageId ) {
        // dispatch(cancelLoading())
        // notifications.show({ color: 'red', title: 'Error', message: `The Exchange is full for ${exchange.teachingLanguageUnfolded.name} speakers`, })
        return;
      }
      if (participantsLearningLanguage.length >= exchange.capacity / 2 && participantsLearningLanguage[0].learningLanguageId === me.learningLanguageId) {
        // dispatch(cancelLoading())
        // notifications.show({ color: 'red', title: 'Error', message: `The Exchange is full for ${exchange.learningLanguageUnfolded.name} speakers`, })
        return;
      }
      let participantsMeAdded = [...exchange.participantIds, me.id]
      await updateDoc('exchanges', id, {...exchange, participantIds: participantsMeAdded });
      await fetchData(id)
      // dispatch(cancelLoading())
      // notifications.show({ color: 'green', title: 'Success', message: 'You Have Joined the exchaged', })
    } catch (error) {
      // dispatch(cancelLoading())
      // notifications.show({ color: 'red', title: 'Error', message: 'Error joining the Exchange', })
    }
  }

  async function handleRemoveMyself() {
    try {
      // dispatch(setLoading())
      let participantsMeRemoved = [...exchange.participantIds]
      participantsMeRemoved.splice(participantsMeRemoved.indexOf(me.id), 1)
      await updateDoc('exchanges', id, {...exchange, participantIds: participantsMeRemoved});
      await fetchData(id)
      // dispatch(cancelLoading())
      // notifications.show({ color: 'green', title: 'Success', message: 'You Have been removed from the Exchange', })
    } catch (error) {
      // dispatch(cancelLoading())
      // notifications.show({ color: 'red', title: 'Error', message: 'Error removing from the Exchange', })
    }
  }

  async function fetchData(id:string) {  
    try {
      const {docSnap} = await getOneDoc("exchanges", id);
      console.log('docSnap.data()', docSnap);
      
      const formattedExchange = formatExchange({...docSnap.data(), id: docSnap.id}, languages)
      console.log('formattedExchange', formattedExchange);
      
      setExchange(formattedExchange)
    } catch (error) {
      // notifications.show({ color: 'red', title: 'Error', message: 'Error gettting exchange', })
    }
  }

  useEffect(() => {
    if (languages.length > 0) {
      fetchData(id)
    }
  }, [languages]); 

  useEffect(() => {
    console.log('users xx xxx', users, exchange);
    if (exchange && users.length > 0) {
      try {
        const participantsTeachingLanguage = users.filter((user) => exchange.participantIds.includes(user.id) && user.teachingLanguageId === exchange.teachingLanguageId)
        const participantsLearningLanguage = users.filter((user) => exchange.participantIds.includes(user.id) && user.learningLanguageId === exchange.teachingLanguageId)
        setParticipantsTeachingLanguage(participantsTeachingLanguage);
        setParticipantsLearningLanguage(participantsLearningLanguage);
        console.log('users', users, exchange);
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
    return <View>{divContainer}</View>;
  }

 console.log('amValidToJoin', amValidToJoin);
 console.log('haveJoined', haveJoined);

   return exchange ? (<ScrollView>
    {!exchange.location && <Image
        source={images.map}
        style={{ backgroundColor: 'powderblue',  width: '100%',}}
    /> 
 }
    {typeof exchange.location === 'object' && 
      // <MapPosition center={exchange.location} /> 
      <Image
        source={images.map}
        style={{ backgroundColor: 'powderblue',  width: '100%',}}
      />
    }
    <Layout style={styles.container}>
      <KText
        style={styles.text}
        category='h6'
      >{exchange.teachingLanguageUnfolded.label} to {exchange.learningLanguageUnfolded.label} Language Exchange at {exchange.location.structured_formatting.main_text}</KText>
      <View style={styles.infoBoxSection}>
        <View style={styles.infoBox}>
          <Icon
            style={styles.icon}
            fill='#8F9BB3'
            name='pin'
          />
          <KText style={styles.text}>{exchange.location.structured_formatting.main_text}</KText>
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
            name='flag'
          />
          <Icon
            style={styles.iconFlag}
            fill='#8F9BB3'
            name='flag-outline'
          />
          <KText style={styles.text}>{exchange.teachingLanguageUnfolded.label}, {exchange.learningLanguageUnfolded.label}</KText>
        </View>
      </View>
      <View style={styles.detailsSection}>
        <KText style={styles.text}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit et molestiae ipsam dignissimos labore. Nostrum exercitationem excepturi voluptas, illum veritatis at animi eum non ad a dolor quos pariatur libero.</KText>
      </View>
      <Divider />
      <KText
        style={{ marginVertical: 10}}
        category='h6'
      >Who's Attending?</KText>
         {/* {participantsList(participantsTeachingLanguage, exchange.teachingLanguageId)} */}

      <View style={styles.participantsContainer}>
        <View style={styles.participantsInnerContainer}>
            <View style={{padding: '30px'}}>
                <View style={styles.participantsColumnTitle}>
                  <Avatar source={require('@/assets/images/spanish.png')}  size='tiny' />
                  <KText  category='label'>{ exchange.teachingLanguageUnfolded.name }: {participantsTeachingLanguage.length} / {exchange.capacity / 2}</KText>
                </View>
                <View style={styles.participantsColumnAvatars}>
                  {participantsList(participantsTeachingLanguage, exchange.teachingLanguageId)}
                </View>
            </View>
            <View style={{padding: '30px'}}>
                <View style={styles.participantsColumnTitle}>
                  <Avatar source={require('@/assets/images/spanish.png')}  size='tiny' />
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
    {amValidToJoin && haveJoined && <Button color="red" fullWidth mt="md" radius="md" onPress={handleRemoveMyself}>
      Remove myself
    </Button> }

    {amValidToJoin && !haveJoined && 
    <Button color="blue" fullWidth mt="md" radius="md" disabled={haveJoined} onPress={handleJoin} loading={isLoading}>
      Join
    </Button> }
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
  }
});

    // <View style={styles.container}>
   
    //   <Text></Text>
    //   <Link href="/exchanges" style={{flex: 1}}>View exchange {id} </Link>
    // </View>
