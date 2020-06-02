import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import colors from './colors';

export default {
  Container: styled.View`
    align-items: center;
    flex: 1 1 auto;
    justify-content: flex-start;
    width: 100%;
  `,

  Button: styled.TouchableOpacity`
    align-items: center;
    background-color: ${colors.brand};
    border-radius: 4px;
    flex-direction: row;
    justify-content: center;
    min-width: 48px;
    padding: 12px;
  `,

  ButtonText: styled.Text`
    color: ${colors.white};
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    text-align: center;
  `,

  FlatList: styled.FlatList`
    background-color: ${colors.white};
    flex: 1 1 auto;
    width: 100%;
  `,

  ListFooter: styled.View`
    align-items: center;
    justify-content: center;
    padding-horizontal: 8px;
    padding-top: 16px;
  `,

  ListFooterText: styled.Text`
    color: ${colors.gray};
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 16px;
    text-align: center;
  `,

  ListChevronWrapper: styled.View``,

  ListChevron: styled(FontAwesomeIcon)`
    color: ${(props) => (props.active ? colors.brand : colors.lightGrayDark)};
    margin-top: 2px;
  `,

  TextInput: styled.TextInput`
    background-color: ${colors.white};
    border-radius: 8px;
    border-width: 0;
    color: ${colors.darkGray};
    font-size: 20px;
    line-height: 24px;
    padding: 12px;
  `,
};

// export default StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     flex: 1,
//     justifyContent: 'flex-start',
//     width: '100%',
//   },
//
//   // FORM ELEMENTS
//
//   button: {
//     alignItems: 'center',
//     backgroundColor: colors.brand,
//     borderRadius: 4,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     minWidth: 48,
//     padding: 12,
//   },
//   buttonText: {
// color: colors.white,
// fontSize: 16,
// fontWeight: '700',
// lineHeight: 24,
// textAlign: 'center',
//   },
//
//   input: {
//     backgroundColor: colors.white,
//     borderRadius: 8,
//     borderWidth: 0,
//     color: colors.darkGray,
//     fontSize: 20,
//     lineHeight: 24,
//     padding: 12,
//   },
//
//   // COMPONENTS
//
//   floatingControls: {
//     backgroundColor: colors.darkGrayTranslucent90,
//     bottom: 0,
//     left: 0,
//     padding: 12,
//     position: 'absolute',
//     right: 0,
//   },
// });
