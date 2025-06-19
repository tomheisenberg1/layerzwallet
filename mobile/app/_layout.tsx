import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppState, AppStateStatus, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useColorScheme } from '@/hooks/useColorScheme';
import { NetworkContextProvider } from '@shared/hooks/NetworkContext';
import { AccountNumberContextProvider } from '@shared/hooks/AccountNumberContext';
import { AskPasswordContextProvider } from '@/src/hooks/AskPasswordContext';
import { AskMnemonicContextProvider } from '@/src/hooks/AskMnemonicContext';
import { SWRConfig } from 'swr';
import { SwrCacheProvider } from '@/src/class/swr-cache-provider';
import { ScanQrContextProvider } from '@/src/hooks/ScanQrContext';
import { LayerzStorage } from '@/src/class/layerz-storage';
import { BackgroundExecutor } from '@/src/modules/background-executor';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
LogBox.ignoreLogs(['Open debugger to view warnings.']);
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Clear session authentication when app goes to background
        // but not during internal navigation
        setTimeout(() => {
          if (AppState.currentState === 'background' || AppState.currentState === 'inactive') {
            console.log('App is in background, clearing session auth');
            LayerzStorage.setItem('session_authenticated', '').catch((err) => {
              console.error('Error clearing session auth:', err);
            });
          }
        }, 500); // Small delay to avoid triggering during quick screen transitions
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SWRConfig
        value={{
          provider: () => new SwrCacheProvider(),
          isVisible: () => {
            return true;
          },
          // @see https://swr.vercel.app/docs/advanced/react-native.en-US
          initFocus(callback) {
            let appState: AppStateStatus = AppState.currentState;

            const onAppStateChange = (nextAppState: AppStateStatus) => {
              /* If it's resuming from background or inactive mode to active one */
              if (appState.match(/inactive|background/) && nextAppState === 'active') {
                callback();
              }
              appState = nextAppState;
            };

            // Subscribe to the app state change events
            const subscription = AppState.addEventListener('change', onAppStateChange);

            return () => {
              subscription.remove();
            };
          },
          // TODO: do we even need this? we would need to use `NetInfo` package. need to make sure if implementing this
          // really makes a difference (e.g. users return from airplane mode)
          // initReconnect(callback) {}
        }}
      >
        <ScanQrContextProvider>
          <AskPasswordContextProvider>
            <AskMnemonicContextProvider>
              <AccountNumberContextProvider storage={LayerzStorage} backgroundCaller={BackgroundExecutor}>
                <NetworkContextProvider storage={LayerzStorage} backgroundCaller={BackgroundExecutor}>
                  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack>
                      <Stack.Screen name="AssetDetail" options={{ headerShown: false }} />
                      <Stack.Screen name="passcode-new" options={{ headerShown: false }} />
                      <Stack.Screen name="unlock" options={{ headerShown: false }} />
                      <Stack.Screen name="index" options={{ headerShown: false, title: 'Home' }} />
                      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
                      <Stack.Screen name="selftest" options={{ title: 'Self Test' }} />
                      <Stack.Screen name="passcode" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/step1" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/step2" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/step3" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/step4" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/import" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/legal" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/seed" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/verify" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/password" options={{ headerShown: false }} />
                      <Stack.Screen name="onboarding/congratulations" options={{ headerShown: false }} />
                    </Stack>
                  </ThemeProvider>
                </NetworkContextProvider>
              </AccountNumberContextProvider>
            </AskMnemonicContextProvider>
          </AskPasswordContextProvider>
        </ScanQrContextProvider>
      </SWRConfig>
    </GestureHandlerRootView>
  );
}
