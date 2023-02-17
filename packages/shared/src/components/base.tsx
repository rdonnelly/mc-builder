import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import colors from '../styles/colors';

const Container = styled.View`
  align-items: center;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const ButtonWrapper = styled(Pressable)``;

const Button = styled(View)<{ pressed?: boolean }>`
  align-items: center;
  background-color: ${colors.slate600};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-direction: row;
  justify-content: center;
  min-height: 48px;
  min-width: 48px;
  opacity: ${(props) => (props.pressed ? '0.9' : '1.0')};
  padding: 12px;
`;

const ButtonText = styled.Text<{ pressed?: boolean }>`
  color: ${colors.white};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 24px;
  text-align: center;
`;

const BaseFlatList = styled(FlatList)`
  background-color: ${colors.white};
  flex: 1 1 auto;
  width: 100%;
`;

const ListHeader = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 8px;
  border-bottom-color: ${colors.slate500};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`;

const ListFooter = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  padding-top: 16px;
`;

const ListFooterText = styled.Text`
  color: ${colors.slate400};
  margin-bottom: 16px;
  text-align: center;
`;

const ListChevronWrapper = styled.View``;

const ListChevron = ({
  isActive,
  size,
}: {
  isActive?: boolean;
  size?: number;
}) => (
  <FontAwesomeIcon
    name={'chevron-right'}
    color={isActive ? colors.slate600 : colors.slate500}
    size={size ? size : 16}
  />
);

const ListIcon = ({
  name,
  color,
  size,
  solid,
}: {
  name: string;
  color?: string;
  size?: number;
  solid?: boolean;
}) => (
  <FontAwesomeIcon
    name={name}
    color={color ? color : colors.slate600}
    size={size ? size : 16}
    solid={solid ? solid : false}
  />
);

const BaseTextInput = styled(TextInput)`
  background-color: ${colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-width: 0;
  color: ${colors.slate600};
  font-size: ${({ theme }) => theme.fontSize.input};
  line-height: 24px;
  padding: 12px;
`;

export default {
  Container: Container,
  ButtonWrapper: ButtonWrapper,
  Button: Button,
  ButtonText: ButtonText,
  FlatList: BaseFlatList,
  ListHeader: ListHeader,
  ListFooter: ListFooter,
  ListFooterText: ListFooterText,
  ListChevronWrapper: ListChevronWrapper,
  ListChevron: ListChevron,
  ListIcon: ListIcon,
  TextInput: BaseTextInput,
};
