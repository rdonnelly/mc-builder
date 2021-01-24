import { Pressable } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

import { base, colors } from '../styles';

// TODO colors: primary, secondary, success, destructive

const FloatingControlBar = styled.View`
  background-color: rgba(52, 73, 94, 0.1);
  border-radius: 4px;
  bottom: 8px;
  flex-direction: row;
  left: 8px;
  padding: 8px 4px;
  position: absolute;
  right: 8px;
`;

FloatingControlBar.FlexButton = React.forwardRef<any, { onPress: any }>(
  (props, ref) => {
    return (
      <FloatingControlPressableFlex onPress={props.onPress}>
        {({ pressed }) => (
          <FloatingControlButton pressed={pressed} ref={ref}>
            <FloatingControlButtonText>
              {props.children}
            </FloatingControlButtonText>
          </FloatingControlButton>
        )}
      </FloatingControlPressableFlex>
    );
  },
);

FloatingControlBar.InlineButton = React.forwardRef<any, { onPress: any }>(
  (props, ref) => {
    return (
      <FloatingControlPressableInline onPress={props.onPress}>
        {({ pressed }) => (
          <FloatingControlButton pressed={pressed} ref={ref}>
            <FloatingControlButtonText>
              {props.children}
            </FloatingControlButtonText>
          </FloatingControlButton>
        )}
      </FloatingControlPressableInline>
    );
  },
);

const FloatingControlPressableFlex = styled(Pressable)`
  flex: 1 1 auto;
  margin-horizontal: 4px;
`;

const FloatingControlPressableInline = styled(Pressable)`
  flex: none;
  margin-horizontal: 4px;
`;

const FloatingControlButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.darkGrayDark : colors.darkGray};
`;

const FloatingControlButtonText = styled(base.ButtonText)<{
  pressed?: boolean;
}>``;

export default FloatingControlBar;
