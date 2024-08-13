import { StyleSheet, View, ImageProps } from 'react-native'
import { Avatar, Button, Spinner, Popover, Autocomplete, AutocompleteItem, Text, Icon } from '@ui-kitten/components';
import React from 'react'

const LoadingIndicator = (props: ImageProps): React.ReactElement => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size='small' />
    </View>
  );

const LoadingButton = ({ status="warning" } : { status: String }) => {
  return (
    <Button
    style={styles.button}
    status={status}
    appearance='outline'
    accessoryLeft={LoadingIndicator}
  >
  </Button>
  )
}

export default LoadingButton

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    button: {
      margin: 2,
    },
    indicator: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });