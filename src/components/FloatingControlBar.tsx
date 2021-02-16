import { Pressable } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

import { base, colors } from '../styles';

// TODO fix typescript

enum FloatingControlButtonVariant {
  ORANGE = 'orange',
  PURPLE = 'purple',
  SUBDUED = 'subdued',
  SUCCESS = 'success',
  DESTRUCTIVE = 'destructive',
  PRIMARY = 'primary',
  INVERTED = 'inverted',
}

const FloatingControlBar = (props) => {
  return (
    <FloatingControlBarContainer>{props.children}</FloatingControlBarContainer>
  );
};

FloatingControlBar.EvenButton = React.forwardRef<
  any,
  { onPress: any; variant: FloatingControlButtonVariant }
>((props, ref) => {
  return (
    <FloatingControlPressableEven onPress={props.onPress}>
      {({ pressed }) => (
        <FloatingControlBarText
          pressed={pressed}
          variant={props.variant}
          wrapped={true}
          ref={ref}
        >
          {props.children}
        </FloatingControlBarText>
      )}
    </FloatingControlPressableEven>
  );
}) as any;

FloatingControlBar.FlexButton = React.forwardRef<
  any,
  { onPress: any; variant: FloatingControlButtonVariant }
>((props, ref) => {
  return (
    <FloatingControlPressableFlex onPress={props.onPress}>
      {({ pressed }) => (
        <FloatingControlBarText
          pressed={pressed}
          variant={props.variant}
          wrapped={true}
          ref={ref}
        >
          {props.children}
        </FloatingControlBarText>
      )}
    </FloatingControlPressableFlex>
  );
}) as any;

FloatingControlBar.InlineButton = React.forwardRef<
  any,
  { onPress: any; variant: FloatingControlButtonVariant }
>((props, ref) => {
  return (
    <FloatingControlPressableInline onPress={props.onPress}>
      {({ pressed }) => (
        <FloatingControlBarText
          pressed={pressed}
          variant={props.variant}
          wrapped={true}
          ref={ref}
        >
          {props.children}
        </FloatingControlBarText>
      )}
    </FloatingControlPressableInline>
  );
}) as any;

const FloatingControlBarText = React.forwardRef<
  any,
  { pressed: boolean; variant: FloatingControlButtonVariant; wrapped?: boolean }
>((props, ref) => (
  <FloatingControlView
    variant={props.variant}
    wrapped={props.wrapped}
    ref={ref}
  >
    <FloatingControlText variant={props.variant}>
      {props.children}
    </FloatingControlText>
  </FloatingControlView>
)) as any;

FloatingControlBar.Text = FloatingControlBarText;

const FloatingControlBarContainer = styled.View`
  background-color: rgba(52, 73, 94, 0.1);
  border-radius: 4px;
  bottom: 8px;
  flex-direction: row;
  left: 8px;
  padding: 8px 4px;
  position: absolute;
  right: 8px;
`;

const FloatingControlPressableEven = styled(Pressable)`
  flex: 1 1 0;
  margin-horizontal: 4px;
`;

const FloatingControlPressableFlex = styled(Pressable)`
  flex: 1 1 auto;
  margin-horizontal: 4px;
`;

const FloatingControlPressableInline = styled(Pressable)`
  flex: none;
  margin-horizontal: 4px;
`;

const FloatingControlView = styled(base.Button)<{
  pressed?: boolean;
  variant?: FloatingControlButtonVariant;
  wrapped?: boolean;
}>`
  background-color: ${(props) => {
    switch (props.variant) {
      case FloatingControlButtonVariant.INVERTED:
        return props.pressed ? colors.white : colors.white;
      case FloatingControlButtonVariant.ORANGE:
        return props.pressed ? colors.orangeDark : colors.orange;
      case FloatingControlButtonVariant.PURPLE:
        return props.pressed ? colors.purpleDark : colors.purple;
      case FloatingControlButtonVariant.SUBDUED:
        return props.pressed ? colors.grayDark : colors.gray;
      case FloatingControlButtonVariant.SUCCESS:
        return props.pressed ? colors.greenDark : colors.green;
      case FloatingControlButtonVariant.DESTRUCTIVE:
        return props.pressed ? colors.redDark : colors.red;
      case FloatingControlButtonVariant.PRIMARY:
      default:
        return props.pressed ? colors.darkGrayDark : colors.darkGray;
    }
  }};
  margin-horizontal: ${(props) => (props.wrapped ? '0' : '4px')};
`;

const FloatingControlText = styled(base.ButtonText)<{
  pressed?: boolean;
  variant?: FloatingControlButtonVariant;
}>`
  color: ${(props) => {
    switch (props.variant) {
      case FloatingControlButtonVariant.INVERTED:
        return props.pressed ? colors.darkGray : colors.darkGray;
      case FloatingControlButtonVariant.ORANGE:
      case FloatingControlButtonVariant.PURPLE:
      case FloatingControlButtonVariant.SUBDUED:
      case FloatingControlButtonVariant.SUCCESS:
      case FloatingControlButtonVariant.DESTRUCTIVE:
      case FloatingControlButtonVariant.PRIMARY:
      default:
        return props.pressed ? colors.white : colors.white;
    }
  }};
`;

export default FloatingControlBar;
export { FloatingControlButtonVariant };
