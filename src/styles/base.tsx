import { Pressable, StyleSheet } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import colors from './colors';

const Container = styled.View`
  align-items: center;
  flex: 1 1 auto;
  justify-content: flex-start;
  width: 100%;
`;

const ButtonWrapper = styled(Pressable)``;

const Button = styled.View<{ pressed?: boolean }>`
  align-items: center;
  background-color: ${colors.brand};
  border-radius: 4px;
  flex-direction: row;
  justify-content: center;
  min-height: 48px;
  min-width: 48px;
  opacity: ${(props) => (props.pressed ? '0.9' : '1.0')};
  padding: 12px;
`;

const ButtonText = styled.Text<{ pressed?: boolean }>`
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
`;

const FlatList = styled.FlatList`
  background-color: ${colors.white};
  flex: 1 1 auto;
  width: 100%;
`;

const ListHeader = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 8px;
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`;

const ListFooter = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  padding-top: 16px;
`;

const ListFooterText = styled.Text`
  color: ${colors.gray};
  font-size: 14px;
  font-weight: 800;
  margin-bottom: 16px;
  text-align: center;
`;

const ListChevronWrapper = styled.View``;

const ListChevron = styled(FontAwesomeIcon)<{ active: boolean }>`
  color: ${(props) => (props.active ? colors.brand : colors.lightGrayDark)};
  margin-top: 2px;
`;

const TextInput = styled.TextInput`
  background-color: ${colors.white};
  border-radius: 8px;
  border-width: 0;
  color: ${colors.darkGray};
  font-size: 20px;
  line-height: 24px;
  padding: 12px;
`;

export default {
  Container: Container,
  ButtonWrapper: ButtonWrapper,
  Button: Button,
  ButtonText: ButtonText,
  FlatList: FlatList,
  ListHeader: ListHeader,
  ListFooter: ListFooter,
  ListFooterText: ListFooterText,
  ListChevronWrapper: ListChevronWrapper,
  ListChevron: ListChevron,
  TextInput: TextInput,
};
