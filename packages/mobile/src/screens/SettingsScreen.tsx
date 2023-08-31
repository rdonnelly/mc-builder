import { CommonActions } from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import styled from 'styled-components/native';

import { useDatabase } from '@hooks/useDatabase';
import { SettingsScreenProps } from '@navigation/SettingsStackNavigator';
import { useAppDispatch } from '@store/hooks';
// import { getDecks } from '@api/deck';
import { reset } from '@store/reducers/decks';

// import { authorizeUser } from '@api/auth';
import base from '@mc-builder/shared/src/components/base';
import { colors } from '@mc-builder/shared/src/styles';
// import { setAuthToken } from '@store/reducers/auth';

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { isSyncing, syncCardData } = useDatabase();
  const dispatch = useAppDispatch();

  const clearStore = () => {
    Alert.alert(
      'Reset Application Data?',
      'This will erase all content and settings (including decks). This data cannot be recovered. Are you sure you want to reset the app?',
      [
        { text: 'Cancel' },
        {
          text: 'Reset',
          onPress: () => {
            dispatch(reset());
            resetNavigation();
          },
          style: 'destructive',
        },
      ],
    );
  };

  const sync = async () => {
    const syncDidSucceed = await syncCardData();

    if (syncDidSucceed) {
      resetNavigation();
    } else {
      Alert.alert(
        'Could Not Sync Card Data',
        'Please ensure that you are connected to the internet and try again.',
        [{ text: 'OK' }],
      );
    }
  };

  const resetNavigation = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'TabSettings' }],
      }),
    );
  };

  // const doThing = async () => {
  //   console.log('doThing');
  //
  //   // console.log(await getDecks());
  //
  //   // try {
  //   //   const result = await authorizeUser();
  //   //   dispatch(setAuthToken({ authResult: result }));
  //   // } catch (error) {
  //   //   return error;
  //   // }
  // };

  return (
    <Container>
      <ScrollView>
        <Information>
          <DisclaimerText>
            The information presented in this app about Marvel Champions, both
            literal and graphical, is copyrighted by Fantasy Flight Games. This
            app is not produced by, endorsed by, supported by, or affiliated
            with Fantasy Flight Games.
          </DisclaimerText>
        </Information>

        <Information>
          <Pressable onPress={() => visitWebpage('https://mcbuilder.app')}>
            {({ pressed }) => (
              <>
                <LinkText pressed={pressed}>Designed and Developed by</LinkText>
                <LinkText pressed={pressed}>Ryan Donnelly</LinkText>
              </>
            )}
          </Pressable>
        </Information>

        <Information>
          <Pressable
            onPress={() =>
              visitWebpage('https://github.com/UnicornSnuggler/Cerebro')
            }
          >
            {({ pressed }) => (
              <>
                <LinkText pressed={pressed}>Card Images Sourced From</LinkText>
                <LinkText pressed={pressed}>Cerebro by Unicorn</LinkText>
              </>
            )}
          </Pressable>
        </Information>

        <Information>
          <InfoButtonWrapper onPress={sync} disabled={isSyncing}>
            {({ pressed }) => (
              <InfoButton pressed={pressed}>
                {isSyncing ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <InfoButtonText>Sync Card Data</InfoButtonText>
                )}
              </InfoButton>
            )}
          </InfoButtonWrapper>
        </Information>

        <Information>
          <DestructiveButtonWrapper onPress={clearStore}>
            {({ pressed }) => (
              <DestructiveButton pressed={pressed}>
                <DestructiveButtonText>
                  Reset Application Data
                </DestructiveButtonText>
              </DestructiveButton>
            )}
          </DestructiveButtonWrapper>
        </Information>
      </ScrollView>
    </Container>
  );
};

const visitWebpage = async (url: string) => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'done',
        preferredBarTintColor: colors.white,
        preferredControlTintColor: colors.sky500,
        readerMode: false,
        animated: true,
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
      });
    } else {
      Linking.openURL(url);
    }
  } catch (error) {
    Linking.openURL(url);
  }
};

const Container = styled(base.Container)`
  background-color: ${({ theme }) => theme.color.app.background};
`;

const ScrollView = styled.ScrollView`
  background-color: ${({ theme }) => theme.color.list.background};
`;

const InfoButtonWrapper = styled(base.ButtonWrapper)``;

const InfoButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${({ pressed, theme }) =>
    pressed
      ? theme.color.button.info.backgroundActive
      : theme.color.button.info.background};
`;

const InfoButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

const DestructiveButtonWrapper = styled(base.ButtonWrapper)``;

const DestructiveButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${({ pressed, theme }) =>
    pressed
      ? theme.color.button.destructive.backgroundActive
      : theme.color.button.destructive.background};
`;

const DestructiveButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

const Information = styled.View`
  border-top-color: ${({ theme }) => theme.color.list.border};
  border-top-width: ${StyleSheet.hairlineWidth}px;
  margin-bottom: 24px;
  margin-horizontal: 16px;
  padding-top: 24px;
`;

const DisclaimerText = styled.Text`
  color: ${({ theme }) => theme.color.typography.subdued};
  text-align: center;
`;

const LinkText = styled.Text<{ pressed: boolean }>`
  color: ${({ theme, pressed }) =>
    pressed ? theme.color.typography.linkActive : theme.color.typography.link};
  font-size: ${({ theme }) => theme.fontSize.regular};
  text-align: center;
`;

export default SettingsScreen;
