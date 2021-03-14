import InAppBrowser from 'react-native-inappbrowser-reborn';
import React from 'react';
import styled from 'styled-components/native';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';

// import { authorizeUser } from '@api/auth';
import { base, colors } from '@styles';
// import { getDecks } from '@api/deck';
import { reset } from '@store/reducers/decks';
// import { setAuthToken } from '@store/reducers/auth';

const SettingsScreen: React.FunctionComponent<{}> = () => {
  const dispatch = useDispatch();

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
          },
          style: 'destructive',
        },
      ],
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
          <Pressable onPress={visitWebpage}>
            {({ pressed }) => (
              <>
                <LinkText pressed={pressed}>Designed and Developed by</LinkText>
                <LinkText pressed={pressed}>Ryan Donnelly</LinkText>
              </>
            )}
          </Pressable>
        </Information>

        <Information>
          <Pressable onPress={clearStore}>
            {({ pressed }) => (
              <LinkText pressed={pressed}>Reset Application Data</LinkText>
            )}
          </Pressable>
        </Information>
      </ScrollView>
    </Container>
  );
};

const visitWebpage = async () => {
  const url = 'https://rdonnelly.com/mc-deck-builder/';
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'done',
        preferredBarTintColor: colors.white,
        preferredControlTintColor: colors.blue,
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
  background-color: ${colors.lightGray};
`;

const Information = styled.View`
  border-top-color: ${colors.lightGrayDark};
  border-top-width: ${StyleSheet.hairlineWidth}px;
  margin-bottom: 24px;
  padding-horizontal: 16px;
  padding-top: 24px;
`;

const DisclaimerText = styled.Text`
  color: ${colors.gray};
  text-align: center;
`;

const LinkText = styled.Text<{ pressed: boolean }>`
  color: ${(props) => (props.pressed ? colors.blueDark : colors.blue)};
  text-align: center;
`;

export default SettingsScreen;
