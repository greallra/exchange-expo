import { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { useGlobalContext } from "@/context/GlobalProvider";
import useLanguages from "@/hooks/useLanguages"
import useFetch from "@/hooks/useFetch"

import { nextTenDays, timeFilterExchanges } from '@/common/timeHelpers'
import { formatExchange } from "@/common/utils"

import { Text, View } from "react-native";
import { Button } from '@ui-kitten/components';
import { ChevronRight, Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons'
import { ListItem, Separator, XStack, YGroup, Text as TText, Paragraph, YStack } from 'tamagui'
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

   return (
      <View className='p-4'>
        <YStack space="$2" alignItems="center"><Paragraph size="$2" fontWeight="800">
          Exchanges in Dublin
        </Paragraph></YStack>
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
                                          
                      <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" space>
                        <YGroup alignSelf="center" bordered width={240} size="$5" size="$5" separator={<Separator />}>
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
                        </YGroup>
                      </XStack>
{/*                   
                      {!areGroupedExchanges && (!isAttending && !isMyLanguages)  && <Text tt="italic" size="xs" c="dimmed" align="center">No exchanges on this day</Text>}
                      {!areGroupedExchanges && (!isAttending && !isMyLanguages)  &&<Divider variant="dotted"  style={{marginTop: '42px'}}/>} */}
                  </View>
              )
          })}
      </View>
  )
}
