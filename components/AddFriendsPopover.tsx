import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { Avatar, Button, Layout, Popover, Autocomplete, AutocompleteItem, Text, Icon } from '@ui-kitten/components';
import useFetch from '@/hooks/useFetch';
import LoadingButton from '@/components/LoadingButton'

const filter = (user, query): boolean => user.username.toLowerCase().includes(query.toLowerCase());

const PopoverSimpleUsageShowcase = ({ loading, handleAddParticipant, exchange }): React.ReactElement => {
    // Popover
    const [visible, setVisible] = React.useState(false);
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

    const renderToggleButton = (): React.ReactElement => (
        <Button onPress={() => setVisible(true)} size='tiny'>
        {!visible ? 'Add Friends' : 'Close'}
        </Button>
    );

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
    <Popover
      visible={visible}
      anchor={renderToggleButton}
      onBackdropPress={() => setVisible(false)}
      placement="top"
      style={{width: '100%'}}
    >
      <Layout style={styles.content}>
        <Avatar
          style={styles.avatar}
          source={{
            uri: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png'
          }}
        />
        <View style={{ width: '100%' }}>
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
        </View>
      </Layout>
    </Popover>
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
     width: 250
  }
});

export default PopoverSimpleUsageShowcase;