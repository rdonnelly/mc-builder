import Clipboard from '@react-native-community/clipboard';

export function setClipboard(string: string) {
  Clipboard.setString(string);
}

export function getClipboard() {
  return Clipboard.getString();
}
