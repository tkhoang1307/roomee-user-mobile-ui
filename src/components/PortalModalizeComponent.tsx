import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';

interface ChoiceItem {
  key: string;
  title: string;
  icon: React.ReactNode;
}

interface Props {
  choiceBars: ChoiceItem[];
  modalizeRef: any;
  renderItem: (item: ChoiceItem) => React.ReactNode;
  // handleChoiceAccommodation: (key: string) => void;
}

const PortalModalizeComponent: React.FC<Props> = ({
  choiceBars,
  modalizeRef,
  renderItem,
  // handleChoiceAccommodation,
}) => {
  return (
    <>
      <Portal>
        <Modalize
          adjustToContentHeight
          ref={modalizeRef}
          handlePosition="inside">
          <View style={PortalModalizeComponentStyle.modalizeStyle}>
            {choiceBars.map(item => renderItem(item))}
          </View>
        </Modalize>
      </Portal>
    </>
  );
};

const PortalModalizeComponentStyle = StyleSheet.create({
  modalizeStyle: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
});

export default PortalModalizeComponent;
