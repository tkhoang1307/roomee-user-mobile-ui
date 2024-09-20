import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';

import {appColors} from '@const/appColors';
import {fontFamilies} from '@const/fontFamilies';

type SegmentedControlProps = {
  options: {value: number; label: string}[];
  selectedOption: number;
  onOptionPress?: (option: number) => void;
  itemWidth?: number;
};

const SegmentedControl: React.FC<SegmentedControlProps> = React.memo(
  ({options, selectedOption, onOptionPress, itemWidth}) => {
    const {width: windowWidth} = useWindowDimensions();
    let segmentedControlWidth, itemWidthInternal;
    const internalPadding = 20;
    segmentedControlWidth = windowWidth - 48;

    itemWidthInternal =
      (segmentedControlWidth - internalPadding) / options.length;
    if (itemWidth) {
      itemWidthInternal = itemWidth;
      segmentedControlWidth = itemWidth * options.length + internalPadding;
    }

    const rStyle = useAnimatedStyle(() => {
      return {
        left: withTiming(
          itemWidthInternal *
            options.findIndex(option => option.value === selectedOption) +
            internalPadding / 2,
        ),
      };
    }, [selectedOption, options, itemWidthInternal]);

    return (
      <View
        style={[
          styles.container,
          {
            width: segmentedControlWidth,
            borderRadius: 10,
          },
        ]}>
        <Animated.View
          style={[
            {
              width: itemWidthInternal,
            },
            rStyle,
            styles.activeBox,
          ]}
        />
        {options.map(option => {
          return (
            <TouchableOpacity
              onPress={() => {
                onOptionPress?.(option.value);
              }}
              key={option.label}
              style={[
                {
                  width: itemWidthInternal,
                },
                styles.labelContainer,
              ]}>
              <Text style={styles.label}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f6f6f7',
  },
  activeBox: {
    position: 'absolute',
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    elevation: 3,
    height: '80%',
    top: '10%',
    backgroundColor: appColors.white,
  },
  labelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
  },
  label: {
    textAlign: 'center',
    fontFamily: fontFamilies.regular,
    fontSize: 14,
  },
});

export default SegmentedControl;
