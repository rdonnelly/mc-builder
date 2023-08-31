import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled, { useTheme } from 'styled-components/native';

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
  background-color: ${({ theme }) => theme.color.button.primary.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex-direction: row;
  justify-content: center;
  min-height: 48px;
  min-width: 48px;
  opacity: ${(props) => (props.pressed ? '0.9' : '1.0')};
  padding: 12px;
`;

const ButtonText = styled.Text<{ pressed?: boolean }>`
  color: ${({ theme }) => theme.color.button.primary.color};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  line-height: 24px;
  text-align: center;
`;

const BaseFlatList = styled(FlatList)`
  background-color: ${({ theme }) => theme.color.app.background};
  flex: 1 1 auto;
  width: 100%;
`;

const ListHeader = styled.View`
  align-items: center;
  background-color: ${({ theme }) => theme.color.list.header.background};
  border-bottom-color: ${({ theme }) => theme.color.list.header.border};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: row;
  justify-content: center;
  padding: 8px;
`;

const ListFooter = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: 8px;
  padding-top: 16px;
`;

const ListFooterText = styled.Text`
  color: ${({ theme }) => theme.color.typography.subdued};
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
}) => {
  const theme = useTheme();

  return (
    <FontAwesomeIcon
      name={'chevron-right'}
      color={isActive ? theme.color.list.iconActive : theme.color.list.icon}
      size={size ? size : 16}
    />
  );
};

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
}) => {
  const theme = useTheme();

  return (
    <FontAwesomeIcon
      name={name}
      color={color ? color : theme.color.list.icon}
      size={size ? size : 16}
      solid={solid ? solid : false}
    />
  );
};

const BaseTextInput = styled(TextInput)`
  background-color: ${({ theme }) => theme.color.input.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-width: 0;
  color: ${({ theme }) => theme.color.input.color};
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
