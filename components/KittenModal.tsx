import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Modal, Text } from '@ui-kitten/components';

export const KittenModal = (
    {children, title = 'The Title', onclick, visible = false, setVisible, isLoading = false } : 
    { title: String, onclick:  Function, visible: Boolean, setVisible:  Function, isLoading: Boolean }): React.ReactElement => {

//   const [visible, setVisible] = React.useState(false);

  <Button onPress={() => setVisible(true)}>
    TOGGLE MODAL
</Button>


  function onContinue() {
    setVisible(false)
    onclick()
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true} style={styles.card}>
          <Text category='s1'>
            {title}
          </Text>
          {children}
          <Button onPress={onContinue}>
             {isLoading ? 'Loading...' : 'Continue'}
          </Button>
          <Button onPress={() => setVisible(false)} status='danger'>
            Cancel
          </Button>
        </Card>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  card: {
    padding: 20
  }
});