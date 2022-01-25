import { NativeScrollEvent } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type useListSearchBarProps = {
  disabled: boolean;
  height: number;
};

export function useListSearchBar({ disabled, height }: useListSearchBarProps) {
  const scrollYValue = useSharedValue(0);
  const scrollUpValue = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    if (disabled) {
      return {
        marginTop: 0,
        opacity: 1,
      };
    }

    cancelAnimation(scrollYValue);

    const opacity = withTiming(
      interpolate(scrollYValue.value, [0, height], [1, 0.5], Extrapolate.CLAMP),
      { duration: 10, easing: Easing.linear },
    );
    const maxHeight = withTiming(
      interpolate(
        scrollYValue.value,
        [0, height],
        [0, -height],
        Extrapolate.CLAMP,
      ),
      { duration: 10, easing: Easing.linear },
    );

    return {
      marginTop: maxHeight,
      opacity: opacity,
    };
  });

  const scrollHandlerWorklet = (
    ev: NativeScrollEvent,
    scrollYValueRef: Animated.SharedValue<number>,
    upValueRef: Animated.SharedValue<number>,
    MAX_HEIGHT: number,
  ) => {
    'worklet';
    const { y } = ev.contentOffset;
    const diff = y - upValueRef.value;
    const newScrollYValue = scrollYValueRef.value + diff;

    if (y < ev.contentSize.height - ev.layoutMeasurement.height) {
      if (y > MAX_HEIGHT) {
        if (y < upValueRef.value) {
          scrollYValueRef.value = Math.max(0, newScrollYValue);
        } else {
          if (scrollYValueRef.value < MAX_HEIGHT) {
            scrollYValueRef.value = Math.min(MAX_HEIGHT, newScrollYValue);
          } else {
            scrollYValueRef.value = MAX_HEIGHT;
          }
        }
        upValueRef.value = Math.max(0, y);
      } else {
        if (upValueRef.value) {
          upValueRef.value = Math.max(0, y);
          scrollYValueRef.value = Math.max(0, newScrollYValue);
        } else {
          scrollYValueRef.value = y;
        }
      }
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollHandlerWorklet(e, scrollYValue, scrollUpValue, height);
    },
  });

  return {
    searchBarScrollHandler: scrollHandler,
    searchBarAnimatedStyles: animatedStyles,
  };
}
