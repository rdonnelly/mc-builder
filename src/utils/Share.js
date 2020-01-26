import { Platform, Share } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export function shareImageUrl(url) {
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

      return false;
    });
  }

  return false;
}
