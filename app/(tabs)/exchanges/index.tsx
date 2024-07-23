import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import useLanguages from "@/hooks/useLanguages"
import useFetch from "@/hooks/useFetch"


import { nextTenDays, timeFilterExchanges } from '@/common/timeHelpers'
import { formatExchange } from "@/common/utils"

import { Text, View, StyleSheet } from "react-native";
import { Button, List, ListItem, Icon } from '@ui-kitten/components';
import ExchangeItem from '@/components/ExchangeItem';


export default function Exchanges() {
  const [loading, setLoading] = useState(true)
  const [exchangesGroupedByDate, setExchangesGroupedByDate] = useState([])
  const { languages } = useLanguages();
  const { data: users } = useFetch('users')
  let { data: exchanges } = useFetch('exchanges')
  const {  user } = useGlobalContext();
  const [isMyLanguages, setIsMyLanguages] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
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
  }, [languages, exchanges, isMyLanguages, isAttending])
  useEffect(() => {
    console.log('exchangesGroupedByDate', exchangesGroupedByDate);
    
  }, [exchangesGroupedByDate])

  function filterExchanges (exchanges){
    let filteredExchanges = exchanges
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

   const renderItemAccessory = (): React.ReactElement => (
    <Button size='tiny'>
FOLLOW
    </Button>
  );
  
   const data = new Array(8).fill({
    title: 'Title for Item',
    description: 'Description for Item',
  });

  const renderItemIcon = (props): IconElement => (
    <Icon
      {...props}
      name='person'
    />
  );

  const renderItem = ({ item, index }: { item: IListItem; index: number }): React.ReactElement => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={renderItemIcon}
      accessoryRight={renderItemAccessory}
    />
  );
  

   return (
    <>  
      <View className='p-4'>
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
          {exchangesGroupedByDate.length > 0 && exchangesGroupedByDate.map((groupedExchange, i) => {
              const areGroupedExchanges = groupedExchange.exchanges.length > 0 
              return (
                  <View key={i}>
                      {areGroupedExchanges && <Text className='flex-ac'>
                          <Text className='mr-1'>{groupedExchange.name}</Text> 
                          <Text c="dimmed" size="xs" mt="xxs">({groupedExchange.datePretty})</Text>
                      </Text>}
                      {!areGroupedExchanges && (!isAttending && !isMyLanguages) && <Text className='flex-ac'>
                          <Text className='mr-1'>{groupedExchange.name}
                          </Text> <Text c="dimmed" size="xs">({groupedExchange.datePretty})</Text>
                      </Text>}
                      {/* <List
                        style={styles.container}
                        data={data}
                        renderItem={renderItem}
                      />       */}
                          {areGroupedExchanges && groupedExchange.exchanges.map((exchange) => {
                              return <ExchangeItem 
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
                          })}
{/*                   
                      {!areGroupedExchanges && (!isAttending && !isMyLanguages)  && <Text tt="italic" size="xs" c="dimmed" align="center">No exchanges on this day</Text>}
                      {!areGroupedExchanges && (!isAttending && !isMyLanguages)  &&<Divider variant="dotted"  style={{marginTop: '42px'}}/>} */}
                  </View>
              )
          })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 200,
  },
});