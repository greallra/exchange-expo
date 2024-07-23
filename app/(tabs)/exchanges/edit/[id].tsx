import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function EditExchange() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Link href="/exchanges">Edit exchange {id} </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
