import { forwardRef } from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import base from '@mc-builder/shared/src/components/base';

enum FloatingControlButtonVariant {
  ORANGE = 'orange',
  PURPLE = 'purple',
  SUBDUED = 'subdued',
  SUCCESS = 'success',
  DESTRUCTIVE = 'destructive',
  PRIMARY = 'primary',
  INVERTED = 'inverted',
  INVERTED_SUCCESS = 'inverted_success',
  INVERTED_DESTRUCTIVE = 'inverted_destructive',
  DISABLED = 'disabled',
}

interface IFloatingControlBar {
  children: React.ReactNode;
  onPress: () => void;
  disabled: boolean;
  variant: FloatingControlButtonVariant;
}

const FloatingControlBar = (props) => {
  return (
    <FloatingControlBarContainer>{props.children}</FloatingControlBarContainer>
  );
};

FloatingControlBar.EvenButton = forwardRef<any, IFloatingControlBar>(
  (props, ref) => {
    return (
      <FloatingControlPressableEven
        onPress={props.onPress}
        disabled={props.disabled}
      >
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
  },
) as any;

FloatingControlBar.FlexButton = forwardRef<any, IFloatingControlBar>(
  (props, ref) => {
    return (
      <FloatingControlPressableFlex
        onPress={props.onPress}
        disabled={props.disabled}
      >
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
  },
) as any;

FloatingControlBar.InlineButton = forwardRef<any, IFloatingControlBar>(
  (props, ref) => {
    return (
      <FloatingControlPressableInline
        onPress={props.onPress}
        disabled={props.disabled}
      >
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
  },
) as any;

const FloatingControlBarText = forwardRef<
  any,
  {
    pressed: boolean;
    variant: FloatingControlButtonVariant;
    wrapped?: boolean;
    children: React.ReactNode;
  }
>((props, ref) => (
  <FloatingControlView
    pressed={props.pressed}
    variant={props.variant}
    wrapped={props.wrapped}
    ref={ref}
  >
    <FloatingControlText pressed={props.pressed} variant={props.variant}>
      {props.children}
    </FloatingControlText>
  </FloatingControlView>
)) as any;

FloatingControlBar.Text = FloatingControlBarText;

const FloatingControlBarContainer = styled.View`
  background-color: rgba(52, 73, 94, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
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
  background-color: ${({ pressed, theme, variant }) => {
    switch (variant) {
      case FloatingControlButtonVariant.DISABLED:
        return pressed
          ? theme.color.button.disabled.backgroundActive
          : theme.color.button.disabled.background;
      case FloatingControlButtonVariant.INVERTED:
        return pressed
          ? theme.color.button.primary.color
          : theme.color.button.primary.color;
      case FloatingControlButtonVariant.INVERTED_SUCCESS:
        return pressed
          ? theme.color.button.success.color
          : theme.color.button.success.color;
      case FloatingControlButtonVariant.INVERTED_DESTRUCTIVE:
        return pressed
          ? theme.color.button.destructive.color
          : theme.color.button.destructive.color;
      case FloatingControlButtonVariant.ORANGE:
        return pressed
          ? theme.color.button.orange.background
          : theme.color.button.orange.background;
      case FloatingControlButtonVariant.PURPLE:
        return pressed
          ? theme.color.button.purple.background
          : theme.color.button.purple.background;
      case FloatingControlButtonVariant.SUBDUED:
        return pressed
          ? theme.color.button.subdued.backgroundActive
          : theme.color.button.subdued.background;
      case FloatingControlButtonVariant.SUCCESS:
        return pressed
          ? theme.color.button.success.backgroundActive
          : theme.color.button.success.background;
      case FloatingControlButtonVariant.DESTRUCTIVE:
        return pressed
          ? theme.color.button.destructive.backgroundActive
          : theme.color.button.destructive.background;
      case FloatingControlButtonVariant.PRIMARY:
      default:
        return pressed
          ? theme.color.button.primary.backgroundActive
          : theme.color.button.primary.background;
    }
  }};
  margin-horizontal: ${(props) => (props.wrapped ? '0' : '4px')};
`;

const FloatingControlText = styled(base.ButtonText)<{
  pressed?: boolean;
  variant?: FloatingControlButtonVariant;
}>`
  color: ${({ pressed, theme, variant }) => {
    switch (variant) {
      case FloatingControlButtonVariant.DISABLED:
        return theme.color.button.disabled.color;
      case FloatingControlButtonVariant.INVERTED:
        return pressed
          ? theme.color.button.primary.backgroundActive
          : theme.color.button.primary.background;
      case FloatingControlButtonVariant.INVERTED_SUCCESS:
        return pressed
          ? theme.color.button.success.backgroundActive
          : theme.color.button.success.background;
      case FloatingControlButtonVariant.INVERTED_DESTRUCTIVE:
        return pressed
          ? theme.color.button.destructive.backgroundActive
          : theme.color.button.destructive.background;
      case FloatingControlButtonVariant.ORANGE:
      case FloatingControlButtonVariant.PURPLE:
      case FloatingControlButtonVariant.SUBDUED:
      case FloatingControlButtonVariant.SUCCESS:
      case FloatingControlButtonVariant.DESTRUCTIVE:
      case FloatingControlButtonVariant.PRIMARY:
      default:
        return pressed
          ? theme.color.button.primary.color
          : theme.color.button.primary.color;
    }
  }};
`;

export default FloatingControlBar;
export { FloatingControlButtonVariant };
