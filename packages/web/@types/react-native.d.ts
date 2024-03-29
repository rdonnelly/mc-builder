import 'react-native';

declare module 'react-native' {
  namespace AppRegistry {
    function registerComponent(
      appKey: string,
      componentProvider: () => React.ComponentType,
    ): void;
    function getApplication(appKey: string): {
      getStyleElement: () =>
        | React.ReactElement[]
        | React.ReactFragment
        | JSX.Element;
    };
  }
}
