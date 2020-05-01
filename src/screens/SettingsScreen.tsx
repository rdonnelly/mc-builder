import * as React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import styled from 'styled-components/native';

import { base, colors } from '../styles';
import { reset } from '../store/reducers/decks';

const SettingsScreen: React.FunctionComponent<{}> = () => {
  const dispatch = useDispatch();

  const clearStore = () => {
    dispatch(reset());
  };

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
          <TouchableOpacity onPress={visitWebpage}>
            <LinkText>Designed and Developed by</LinkText>
            <LinkText>Ryan Donnelly</LinkText>
          </TouchableOpacity>
        </Information>

        <Information>
          <TouchableOpacity onPress={clearStore}>
            <LinkText>Clear Store</LinkText>
          </TouchableOpacity>
        </Information>
      </ScrollView>
    </Container>
  );
};

const visitWebpage = async () => {
  try {
    const url = 'https://rdonnelly.com';
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'done',
        preferredBarTintColor: colors.headerTint,
        preferredControlTintColor: colors.headerBackground,
        readerMode: false,
        // Android Properties
        showTitle: true,
      });
    } else {
      Linking.openURL(url);
    }
  } catch (error) {
    Alert.alert('Could Not Open Browser');
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

const LinkText = styled.Text`
  color: ${colors.blue};
  text-align: center;
`;

export default SettingsScreen;
