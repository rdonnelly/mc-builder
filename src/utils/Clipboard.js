import { Clipboard } from 'react-native';

export function setClipboard(string) {
  Clipboard.setString(string);
}
