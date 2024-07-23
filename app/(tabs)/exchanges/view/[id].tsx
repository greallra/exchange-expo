import { useLocalSearchParams, Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function ViewExchange() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Link href="/exchanges">View exchange {id} </Link>
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
