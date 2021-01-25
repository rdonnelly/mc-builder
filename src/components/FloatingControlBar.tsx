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
        <FloatingControlButton
          ref={ref}
          pressed={pressed}
          variant={props.variant}
        >
          <FloatingControlButtonText>
            {props.children}
          </FloatingControlButtonText>
        </FloatingControlButton>
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
        <FloatingControlButton
          pressed={pressed}
          variant={props.variant}
          ref={ref}
        >
          <FloatingControlButtonText>
            {props.children}
          </FloatingControlButtonText>
        </FloatingControlButton>
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
        <FloatingControlButton
          pressed={pressed}
          variant={props.variant}
          ref={ref}
        >
          <FloatingControlButtonText>
            {props.children}
          </FloatingControlButtonText>
        </FloatingControlButton>
      )}
    </FloatingControlPressableInline>
  );
}) as any;

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

const FloatingControlButton = styled(base.Button)<{
  pressed?: boolean;
  variant?: FloatingControlButtonVariant;
}>`
  background-color: ${(props) => {
    switch (props.variant) {
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
`;

const FloatingControlButtonText = styled(base.ButtonText)<{
  pressed?: boolean;
}>``;

export default FloatingControlBar;
export { FloatingControlButtonVariant };
