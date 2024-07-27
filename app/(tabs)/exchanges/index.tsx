import { useState, useEffect, useCallback } from 'react';
import { Link, router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import useLanguages from "@/hooks/useLanguages"
import useFetch from "@/hooks/useFetch"
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import { setActivePage } from '@/features/header/headerSlice'
import { useFocusEffect } from '@react-navigation/native';


import { nextTenDays, timeFilterExchanges } from '@/common/timeHelpers'
import { formatExchange } from "@/common/utils"

import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button, List, ListItem, Icon, Text as KText, Divider, IconElement, Tab, TabBar, TabBarProps, CheckBox, CheckBoxProps, Layout } from '@ui-kitten/components';
import ExchangeItem from '@/components/ExchangeItem';

export default function Exchanges() {
  const [loading, setLoading] = useState(true)
  const [exchangesGroupedByDate, setExchangesGroupedByDate] = useState([])
  const { languages } = useLanguages();
  const { data: users } = useFetch('users')
  let { data: exchanges } = useFetch('exchanges')
  const { user } = useGlobalContext();

  // tabs 
  // const useTabBarState = (initialState = 0): Partial<TabBarProps> => {
  //   const [selectedIndex, setSelectedIndex] = useState(initialState);
  //   return { selectedIndex, onSelect: setSelectedIndex };
  // };
  // const topState = useTabBarState();
  const dispatch = useDispatch()
  useFocusEffect(
    useCallback(() => { dispatch(setActivePage({ activePage: 'Language Exchanges in your area', leftside: ''})) }, [])
  );

  const useCheckboxState = (initialCheck = false): CheckBoxProps => {
    const [checked, setChecked] = useState(initialCheck);
    return { checked, onChange: setChecked };
  };
  const isMyExchanges = useCheckboxState();
  const isMyLanguages = useCheckboxState();
  const isAttending = useCheckboxState();

  function setExchanges() {
    if (exchanges.length > 0 && languages.length > 0) {
        exchanges = exchanges.map(exchange => formatExchange(exchange, languages, users))
        console.log('exchanges', exchanges);
        
        const groupedByDateExchanges = nextTenDays.map((day) => {
            return {
            ...day,
            exchanges: timeFilterExchanges(filterExchanges(exchanges), day)
          }
        }) 
        setExchangesGroupedByDate(groupedByDateExchanges)
        setLoading(false)
    }
  }

  useEffect(() => {
    setExchanges()
  }, [ languages, exchanges, isAttending.checked, isMyLanguages.checked, isMyExchanges.checked ])


  // useEffect(() => {
  //   if (topState.selectedIndex === 2) {
  //     setIsMyExchanges(true)  
  //   } else {
  //     setIsMyExchanges(false)
  //   }
  //   console.log('topState', topState.selectedIndex, isMyLanguages);
    
  // }, [topState])

  function filterExchanges (exchanges){
    let filteredExchanges = exchanges
        if (isMyExchanges.checked) {
            console.log(123);
            
            filteredExchanges = exchanges.filter( exchange => exchange.organizerId === user.id)
        }
        if (isMyLanguages.checked) {
            filteredExchanges = exchanges.filter( exchange => {
                return [exchange.teachingLanguageId, exchange.learningLanguageId].includes(user.teachingLanguageId) &&
                [exchange.teachingLanguageId, exchange.learningLanguageId].includes(user.learningLanguageId)
            })
        }
        if (isAttending.checked) {
            filteredExchanges = exchanges.filter( exchange => exchange.participantIds.includes(user.id))
        }
        return filteredExchanges
   }
  
  // const data = new Array(8).fill({
  //   title: 'Title for Item',
  //   description: 'Description for Item',
  // });
  console.log('exchangesGroupedByDate', exchangesGroupedByDate);
  // const route = useRoute();
  // console.log('route', route);
  

   return (
    <>  
      <View style={styles.container}>
          {/* <div className='filter-switch'>
              <Box className='flex-sb'><Text tt="italic" size="xs" c="dimmed">Your Native Language is: </Text> {user && <UserFlag src={user.teachingLanguageUnfoled.smallFlag}/>}</Box>
              <Box className='flex-sb'><Text tt="italic" size="xs" c="dimmed">Your Learning Language is: </Text> {user && <UserFlag src={user.learningLanguageUnfoled.smallFlag}/>}</Box>
              <Switch mt="xs" defaultChecked={false} label="Target my Languages"  checked={isMyLanguages}
                  onChange={(event) => setIsMyLanguages(event.currentTarget.checked)}/>
              <Switch defaultChecked={false} label="Show attending" className='mt-1'  checked={isAttending}
                  onChange={(event) => setIsAttending(event.currentTarget.checked)}/>
          </div>
          <div className='info-corner'>
          <Tooltip label="This means an exchange matches your languages">
              <Box className='flex-al'>
              <IconChecks style={{ width: '15px', height: '15px', marginRight: '5px' }}  stroke={4.0} color='green'/> =
              <Text ml="xs"  size="sm" fw={700}>Language Match</Text>
          </Box></Tooltip>
          </div> */}
          {/* <TabBar {...topState} style={{ padding: 0}}>
            <Tab icon={<Icon name='people-outline' />} title="All Exchanges" style={{ padding: 0}}/>
            <Tab icon={<Icon name='globe-outline' />} title="Map View" style={{ padding: 0}}/>
            <Tab icon={<Icon name='person-outline' />} title="My Exchanges" style={{ padding: 0}}/>
          </TabBar> */}
          <Layout style={[styles.fc, { marginBottom: 10 }]}>
            <CheckBox style={styles.checkbox} status='primary' {...isMyLanguages}>
              <KText category='h1'>My Languages</KText>
            </CheckBox>
            <CheckBox style={styles.checkbox} status='primary' {...isMyExchanges}>
              My Exchanges
            </CheckBox>
            <CheckBox style={styles.checkbox} status='primary' {...isAttending}>
              Attending
            </CheckBox>
          </Layout>
          <Divider style={{ marginVertical: 5, paddingVertical: 0.5, }}/>
          <ScrollView>
          {exchangesGroupedByDate.length > 0 && exchangesGroupedByDate.map((groupedExchange, i) => {
              const areGroupedExchanges = groupedExchange.exchanges.length > 0 
              return (
                  <View key={i}>
                         <>

                          </>
                      {/* {(!isAttending.checked && !isMyLanguages.checked) && */}
                      <KText style={[styles.dateHeader]}>
                          <KText  category='h5'>{groupedExchange.name}</KText> 
                          {!groupedExchange.hideDate && <KText style={{ marginLeft: 15}}>({groupedExchange.datePretty})</KText>}
                      </KText>
                      {/* } */}
                      {!areGroupedExchanges && (!isAttending && !isMyLanguages) && <KText className='flex-ac'>
                          <KText category='h5'>{groupedExchange.name}
                          </KText> <KText>({groupedExchange.datePretty})</KText>
                      </KText>}
                      {/* <List
                        style={styles.container}
                        data={data}
                        renderItem={renderItem}
                      />       */}
                          {areGroupedExchanges && groupedExchange.exchanges.map((exchange) => {
                              return <><ExchangeItem 
                              id={exchange.id}
                              key={exchange.id}
                              name={exchange.name} 
                              location={exchange.location} 
                              capacity={exchange.capacity} 
                              organizerId={exchange.organizerId} 
                              organizerUnfolded={exchange.organizerUnfolded} 
                              time={exchange.timeHour}
                              learningLanguageId={exchange.learningLanguageId}
                              teachingLanguageId={exchange.teachingLanguageId}
                              learningLanguageUnfolded={exchange.learningLanguageUnfolded}
                              teachingLanguageUnfolded={exchange.teachingLanguageUnfolded}
                              participantIds={exchange.participantIds}
                              users={users}
                              />
                              {isMyExchanges.checked && <Button onPress={() => router.push(`/exchanges/edit/${exchange.id}`)} size="tiny">Edit </Button>}
                              <Divider /></>
                          })}
                  
                      {!areGroupedExchanges && (!isAttending.checked && !isMyLanguages.checked)  && <KText appearance='hint'>No exchanges on this day</KText>}
                      {/* {!areGroupedExchanges && (!isAttending && !isMyLanguages)  &&<Divider variant="dotted"  style={{marginTop: '42px'}}/>} */}
                  </View>
              )
          })}
          </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  fc: {
    display: 'flex',
    flexDirection: 'row'
  },
  container: {
    backgroundColor: 'white',
    padding: 10,
    height: '100%',
  },
  dateHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    padding: 0,
    margin: 0,
  },
});