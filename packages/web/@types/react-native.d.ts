import React from 'react';
import * as ReactNative from 'react-native'; // eslint-disable-line @typescript-eslint/no-unused-vars

declare module 'react-native' {
  namespace AppRegistry {
    function registerComponent(
      appKey: string,
      componentProvider: () => React.ComponentType,
    ): void;
    function getApplication(appKey: string): { getStyleElement: () => string };
  }
}
