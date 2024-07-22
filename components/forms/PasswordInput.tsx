import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { Icon, IconElement, Input, Text } from '@ui-kitten/components';

const AlertIcon = (props): IconElement => (
  <Icon
    {...props}
    name='alert-circle-outline'
  />
);

type Color = "warning" | 'info'| 'success' | 'danger'

interface PasswordInputProps {
  color: Color,
  value: string,
  error: boolean,
  setValue: (val: string) => void
}
// { error = false }: {error: boolean }
export const PasswordInput = ({ value, setValue, error = false, ...props }: PasswordInputProps): React.ReactElement => {

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const toggleSecureEntry = (): void => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props: any): React.ReactElement => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  );

  const renderCaption = (): React.ReactElement => {
    return (
      <View style={styles.captionContainer}>
        {AlertIcon(styles.captionIcon)}
        <Text style={styles.captionText}>
Should contain at least 8 symbols
        </Text>
      </View>
    );
  };

  return (
    <View  className="mt-2">
    <Input
      value={value}
      label='Password'
      placeholder='Place your Text'
      caption={error && renderCaption}
    //   accessoryRight={renderIcon}
      secureTextEntry={secureTextEntry}
      onChangeText={nextValue => setValue(nextValue)}
    />
    </View>

  );
};

const styles = StyleSheet.create({
  captionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionIcon: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  captionText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'opensans-regular',
    color: '#8F9BB3',
  },
});