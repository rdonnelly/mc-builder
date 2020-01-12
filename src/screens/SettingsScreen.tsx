import * as React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import {base, colors} from '../styles';

const styles = StyleSheet.create({
  container: {
    ...base.container,
    backgroundColor: colors.lightGray,
  },
  information: {
    borderColor: colors.lightGrayDark,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  disclaimerText: {
    color: colors.gray,
    textAlign: 'center',
  },
  linkText: {
    color: colors.brand,
    textAlign: 'center',
  },
});

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

export default () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.information}>
          <Text style={styles.disclaimerText}>
            The information presented in this app about Marvel Champions, both
            literal and graphical, is copyrighted by Fantasy Flight Games. This
            app is not produced by, endorsed by, supported by, or affiliated
            with Fantasy Flight Games.
          </Text>
        </View>

        <View style={styles.information}>
          <TouchableOpacity onPress={visitWebpage}>
            <Text style={styles.linkText}>Designed and Developed by</Text>
            <Text style={styles.linkText}>Ryan Donnelly</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
