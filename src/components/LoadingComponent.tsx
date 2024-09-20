import {View, ActivityIndicator} from 'react-native';
import React from 'react';
import {TextComponent} from '.';
import {useTranslation} from 'react-i18next';

interface Props {
  isLoading: boolean;
  values: number;
  mess?: string;
}

const LoadingComponent = (props: Props) => {
  const {isLoading, values, mess} = props;
  const {t} = useTranslation();

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        values === 0 && (
          <TextComponent text={mess ?? t('label.noAccommodation')} />
        )
      )}
    </View>
  );
};

export default LoadingComponent;
