import Clipboard from '@react-native-clipboard/clipboard';

export function setClipboard(string: string) {
  Clipboard.setString(string);
}

export function getClipboard() {
  return Clipboard.getString();
}
