import { Platform, Share, ShareContent } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export function shareUrl(url: string) {
  let shareObject: ShareContent = null;

  switch (Platform.OS) {
    case 'android': {
      shareObject = {
        message: url,
      };
      break;
    }
    case 'ios': {
      shareObject = {
        url: url,
      };
      break;
    }
  }

  return Share.share(shareObject);
}

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
