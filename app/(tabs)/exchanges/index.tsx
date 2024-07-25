import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import useLanguages from "@/hooks/useLanguages"
import useFetch from "@/hooks/useFetch"


import { nextTenDays, timeFilterExchanges } from '@/common/timeHelpers'
import { formatExchange } from "@/common/utils"

import { Text, View, StyleSheet } from "react-native";
import { Button, List, ListItem, Icon, Text as KText, Divider, IconElement, Tab, TabBar, TabBarProps } from '@ui-kitten/components';
import ExchangeItem from '@/components/ExchangeItem';

export default function Exchanges() {
  const [loading, setLoading] = useState(true)
  const [exchangesGroupedByDate, setExchangesGroupedByDate] = useState([])
  const { languages } = useLanguages();
  const { data: users } = useFetch('users')
  let { data: exchanges } = useFetch('exchanges')
  const { user } = useGlobalContext();
  const [isMyExchanges, setIsMyExchanges] = useState(true);
  const [isMyLanguages, setIsMyLanguages] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  const useTabBarState = (initialState = 0): Partial<TabBarProps> => {
    const [selectedIndex, setSelectedIndex] = useState(initialState);
    return { selectedIndex, onSelect: setSelectedIndex };
  };
  const topState = useTabBarState();

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
  }, [languages, exchanges, isMyLanguages, isAttending])

  useEffect(() => {
    if (topState.selectedIndex === 2) {
      setIsMyExchanges(true)  
    } else {
      setIsMyExchanges(false)
    }
    console.log('topState', topState.selectedIndex, isMyLanguages);
    
  }, [topState])
  // useEffect(() => {
  //   console.log('isMyLanguages', isMyLanguages);
  //   setExchanges()
  // }, [isMyLanguages])

  function filterExchanges (exchanges){
    let filteredExchanges = exchanges
    console.log('isMyExchanges isMyExchanges', isMyExchanges);
        if (isMyExchanges) {
            filteredExchanges = exchanges.filter( exchange => exchange.organizerId === user.id)
        }
        if (isMyLanguages) {
            filteredExchanges = exchanges.filter( exchange => {
                return [exchange.teachingLanguageId, exchange.learningLanguageId].includes(user.teachingLanguageId) &&
                [exchange.teachingLanguageId, exchange.learningLanguageId].includes(user.learningLanguageId)
            })
        }
        if (isAttending) {
            console.log('isAttending', isAttending);
            
            filteredExchanges = exchanges.filter( exchange => exchange.participantIds.includes(user.id))
        }
        return filteredExchanges
   }
  
   const data = new Array(8).fill({
    title: 'Title for Item',
    description: 'Description for Item',
  });

  const PersonIcon = (props): IconElement => (
    <Icon {...props}
      name='person-outline'
    />
  );
  
  const GlobeIcon = (props): IconElement => (
    <Icon
      {...props}
      name='globe-2-outline'
    />
  );
  
  const PeopleIcon = (props): IconElement => (
    <Icon
      {...props}
      name='people-outline'
    />
  );

  console.log('topState', topState);
  

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
          <TabBar {...topState} style={{ padding: 0}}>
            <Tab icon={PeopleIcon} title="All Exchanges" style={{ padding: 0}}/>
            <Tab icon={GlobeIcon} title="Map View"/>
            <Tab icon={PersonIcon} title="My Exchanges"/>
          </TabBar>
          {(topState.selectedIndex === 0 || topState.selectedIndex === 2) && exchangesGroupedByDate.length > 0 && exchangesGroupedByDate.map((groupedExchange, i) => {
              const areGroupedExchanges = groupedExchange.exchanges.length > 0 
              return (
                  <View key={i}>
                         <>

                          </>
                      {areGroupedExchanges && 
                      <KText style={[styles.dateHeader]}>
                          <KText  category='h5'>{groupedExchange.name}</KText> 
                          {!groupedExchange.hideDate && <KText style={{ marginLeft: 15}}>({groupedExchange.datePretty})</KText>}
                      </KText>}
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
                              <Divider /></>
                          })}
                  
                      {!areGroupedExchanges && (!isAttending && !isMyLanguages)  && <KText appearance='hint'>No exchanges on this day</KText>}
                      {/* {!areGroupedExchanges && (!isAttending && !isMyLanguages)  &&<Divider variant="dotted"  style={{marginTop: '42px'}}/>} */}
                  </View>
              )
          })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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
  }
});