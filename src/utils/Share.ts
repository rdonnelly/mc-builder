import RNFetchBlob from 'rn-fetch-blob';
import { Platform, Share } from 'react-native';

export function shareImageUrl(url: string) {
  if (Platform.OS === 'ios') {
    return RNFetchBlob.fetch('GET', url, {}).then((res) => {
      const { status } = res.info();

      if (status === 200) {
        const base64Str = res.base64();
        const shareImage = {
          url: `data:image/png;base64,${base64Str}`,
        };

        return Share.share(shareImage);
      }

      return Promise.reject();
    });
  }

  return false;
}
