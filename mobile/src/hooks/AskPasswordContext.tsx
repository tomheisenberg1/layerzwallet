import React, { createContext, ReactNode, useState } from 'react';
import { Modal, TextInput, View, Text, Pressable, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface IAskPasswordContext {
  askPassword: () => Promise<string>;
}

export const AskPasswordContext = createContext<IAskPasswordContext>({
  askPassword: (): Promise<string> => Promise.reject('askPassword: this should never happen'),
});

type ResolverFunction = (resolveValue: string) => void;

/**
 * This provider provides an async function `askPassword()` that shows a Modal asking for a user password,
 * and resolves to a string that the user typed.
 */
export const AskPasswordContextProvider: React.FC<{ children: ReactNode }> = (props) => {
  const [isAskingPassword, setIsAskingPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [resolverFunc, setResolverFunc] = useState<ResolverFunction>(() => () => {});

  const backgroundColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
  const tintColor = useThemeColor({ light: '#2f95dc', dark: '#fff' }, 'tint');

  const askPassword = (): Promise<string> => {
    setIsAskingPassword(true);
    setPassword('');

    return new Promise((resolve) => {
      setResolverFunc(() => resolve);
    });
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const onOkPress = () => {
    resolverFunc(password);
    // cleanup:
    setPassword('');
    setIsAskingPassword(false);
  };

  const onCancelPress = () => {
    resolverFunc('');
    setPassword('');
    setIsAskingPassword(false);
  };

  return (
    <AskPasswordContext.Provider value={{ askPassword }}>
      {props.children}
      <Modal animationType="slide" transparent={true} visible={isAskingPassword} onRequestClose={onCancelPress}>
        <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalView, { backgroundColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Unlock your wallet</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: tintColor }]}
              secureTextEntry
              placeholder="Enter your password"
              placeholderTextColor="#888"
              value={password}
              onChangeText={handlePasswordChange}
              autoFocus
            />
            <View style={styles.buttonContainer}>
              <Pressable style={[styles.button, styles.buttonCancel]} onPress={onCancelPress}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonConfirm, { backgroundColor: tintColor }]} onPress={onOkPress}>
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </AskPasswordContext.Provider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    minWidth: '40%',
    alignItems: 'center',
  },
  buttonConfirm: {
    backgroundColor: '#2196F3',
  },
  buttonCancel: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
