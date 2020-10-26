import Clipboard from '@react-native-community/clipboard';

export function setClipboard(string) {
  Clipboard.setString(string);
}
