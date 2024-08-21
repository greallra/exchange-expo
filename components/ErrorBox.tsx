// import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import styles from "@/common/styles"
import { Text as KText, Card } from '@ui-kitten/components';

const ErrorBox = ({ error }: { error: string }) => {
  return (
    <Card status='danger' style={styles.errorBox}>
        <KText style={styles.errorText} status='danger'>
        {error}
        </KText>
    </Card>
  )
}

export default ErrorBox

// const styles = StyleSheet.create({})