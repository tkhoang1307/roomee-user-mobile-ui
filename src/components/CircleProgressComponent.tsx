import {View, StyleProp, ViewStyle, Animated, Easing} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import Svg, {Circle, Text} from 'react-native-svg';

import {fontFamilies} from '@const/fontFamilies';

interface CircularProgressProps {
  progress: number;
  circleColor: string;
  size?: number;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  step: number;
  current: number;
}

const CircleProgressComponent = (
  props: CircularProgressProps,
): React.ReactElement => {
  const {
    progress,
    circleColor,
    size = 24,
    strokeWidth = 6,
    style = {},
    step,
    current,
  } = props;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true, // Native driver is useful for improving performance
    }).start();
  }, [progress]);

  const getStrokeDashOffset = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[style]}>
      <Svg style={{width: size, height: size}}>
        {/* Background circle */}
        <Circle
          stroke={'#b5b4b4'}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={'none'}
          strokeDasharray={[circumference]}
        />
        {/* Active progress */}
        <AnimatedCircle
          stroke={circleColor}
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={'none'}
          strokeDasharray={[circumference]}
          strokeDashoffset={getStrokeDashOffset}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
        <Text
          x={size / 2}
          y={size / 2 + 4}
          textAnchor="middle"
          fontFamily={fontFamilies.bold}>
          {`${current} / ${step}`}
        </Text>
      </Svg>
    </View>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default CircleProgressComponent;
