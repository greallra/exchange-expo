import { useState, useEffect, useCallback } from 'react';
import { Link, router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import useLanguages from "@/hooks/useLanguages"
import useFetch from "@/hooks/useFetch"
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import { setActivePage } from '@/features/header/headerSlice'
import { useFocusEffect } from '@react-navigation/native';
import { timeFilterExchanges, nextTenDays, formatExchange } from 'exchanges-shared'

import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button, List, ListItem, Icon, Text as KText, Divider, IconElement, Tab, TabBar, TabBarProps, CheckBox, CheckBoxProps, Layout } from '@ui-kitten/components';
import ExchangeItem from '@/components/ExchangeItem';
import Loader from '@/components/Loader'

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
      <Layout style={styles.container} level='2'>

          <View style={[styles.fc, { marginBottom: 10 }]}>
            <CheckBox style={styles.checkbox} status='warning' {...isMyLanguages}>
              <KText category='h1'>My Languages</KText>
            </CheckBox>
            <CheckBox style={styles.checkbox} status='info' {...isMyExchanges}>
              My Exchanges
            </CheckBox>
            <CheckBox style={styles.checkbox} status='success' {...isAttending}>  
              <KText category='h1' status='success'>Attending</KText>
            </CheckBox>
          </View>
          <Divider style={{ marginVertical: 5, paddingVertical: 0.5, height: 1, backgroundColor: '#C5CEE0'}}/>
          <ScrollView>
          {exchangesGroupedByDate.length ===  0 && <Loader isLoading={loading} />}
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
                              return <View key={exchange.id}><ExchangeItem 
                              id={exchange.id}
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
                              isMyLanguages={isMyLanguages.checked}
                              isMyExchanges={isMyExchanges.checked}
                              />
                              {isMyExchanges.checked && <Button onPress={() => router.push(`/exchanges/edit/${exchange.id}`)} size="tiny">Edit </Button>}
                              <Divider />
                              </View>
                          })}
                  
                      {!areGroupedExchanges && (!isAttending.checked && !isMyLanguages.checked)  && <KText appearance='hint'>No exchanges on this day</KText>}
                      {/* {!areGroupedExchanges && (!isAttending && !isMyLanguages)  &&<Divider variant="dotted"  style={{marginTop: '42px'}}/>} */}
                  </View>
              )
          })}
          </ScrollView>
      </Layout>
    </>
  )
}

const styles = StyleSheet.create({
  fc: {
    display: 'flex',
    flexDirection: 'row'
  },
  container: {
    // backgroundColor: 'white',
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