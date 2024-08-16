import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Avatar, Button, Autocomplete, AutocompleteItem, Text, Icon } from '@ui-kitten/components';
import useFetch from '@/hooks/useFetch';
import LoadingButton from '@/components/LoadingButton'

const filter = (user, query): boolean => user.username ? user.username.toLowerCase().includes(query.toLowerCase()) : false;

const AddFriendsAutoComplete = ({ visible, setVisible, loading, handleAddParticipant, exchange }): React.ReactElement => {
    // Popover
    const { data: users } = useFetch('users')
    const [value, setValue] = React.useState(null);
    const [data, setData] = React.useState(users);
  
    const onSelect = useCallback((index): void => {
      setValue(data[index].username);
    }, [data]);
    useEffect(() => {
        const addDisabledUsers = users.map((user) => {
            return {
                ...user,
                disabled: !checkForlanguageMatch(user)
            }
        })
        setData(addDisabledUsers);
    }, [users]);
  
    const onChangeText = useCallback((query): void => {
      setValue(query);
      let filteredData = data.filter(item => filter(item, query))
      setData(filteredData);
    }, []);

    function onAddParticipant() {
        const userObject = users.find( user => user.username === value)
        handleAddParticipant(userObject);
    }

    function checkForlanguageMatch(user) {
        let exchangeLanguagesIds = [exchange.learningLanguageId, exchange.teachingLanguageId];
        return exchangeLanguagesIds.includes(user.learningLanguageId) && exchangeLanguagesIds.includes(user.teachingLanguageId)
    }

    // const renderToggleButton = (): React.ReactElement => (
    //     <Button onPress={() => setVisible(true)} size='tiny'>
    //     {!visible ? 'Add Friends' : 'Close'}
    //     </Button>
    // );

    const renderOption = (item, index): React.ReactElement => (
        <AutocompleteItem
          key={index}
          title={!item.disabled ? item.username  : `${item.username } (disabled)`}
          accessoryLeft={AvatarOption}
          disabled={false}
        />
      );

    const AvatarOption = (props): IconElement => (
        <Avatar
        style={styles.avatar}
        source={{
          uri: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png'
        }}
      />
    );
    
    

  return (
    <>
            <TouchableOpacity  onPress={() => setVisible(false)}>
              <Icon
                  style={styles.icon} 
                  name='close-outline'
                  animation="shake"
              />
            </TouchableOpacity>
            <Autocomplete
                placeholder='Search by username'
                value={value}
                placement='inner top'
                onSelect={onSelect}
                onChangeText={onChangeText}
                style={styles.autocomplete}
                >
                {data.map(renderOption)}
            </Autocomplete>
            {value && 
            <View style={{ width: 100, display: 'flex', flexDirection: 'row', padding: 5 }}>
                {!loading && <Button style={{ marginRight: 10 }} size='small' status='warning' onPress={onAddParticipant}>Add</Button>}
                <Button status='danger' size='small' disabled={loading} onPress={() => setValue(null)}>Cancel</Button> 
                {loading && <LoadingButton />}
            </View>}
        </>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    width: '100%'
  },
  avatar: {
    marginHorizontal: 4,
  },
  autocomplete: {
     width: 300
  },
  bStyle: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)'
  },
  icon: {
    width: 42,
    height: 42,
    margin: 10
  },
});

export default AddFriendsAutoComplete;