import {View, Alert, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {ruleService} from '@services';
import {DetailRuleModel} from '@models/rule';
import {ErrorResponseAxios} from '@models/error';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {FormModalStyle} from '../styles';

interface EditRuleModalProps {
  accommodationId: string;
  rule: DetailRuleModel;
  setListRules: React.Dispatch<React.SetStateAction<Array<DetailRuleModel>>>;
  isOpenEditModal: boolean;
  setIsOpenEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditRuleModal: React.FC<EditRuleModalProps> = ({
  accommodationId,
  rule,
  setListRules,
  isOpenEditModal,
  setIsOpenEditModal,
}) => {
  const {t} = useTranslation();
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    setDescription(rule.description);
  }, [isOpenEditModal]);

  const handleEditRule = async () => {
    try {
      if (!description) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }

      const payload = {
        accommodationId: accommodationId,
        description: description,
      };

      const resDataUpdateRule = await ruleService.updateTheDescriptionOfRule(
        rule.id,
        payload,
      );
      if (resDataUpdateRule !== undefined || resDataUpdateRule !== null) {
        setListRules(prevRules => {
          const updatedRuleIndex = prevRules.findIndex(u => u.id === rule.id);
          if (updatedRuleIndex !== -1) {
            const updatedRules = [...prevRules];
            updatedRules[updatedRuleIndex] = {
              ...updatedRules[updatedRuleIndex],
              description: description,
            };
            return updatedRules;
          }
          return prevRules;
        });
      }
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
      setIsOpenEditModal(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      maskClosable
      visible={isOpenEditModal}
      onClose={() => setIsOpenEditModal(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.edit'),
          onPress: () => handleEditRule(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '110%'}}>
        <View style={{width: '90%'}}>
          <TextComponent
            text={t('actions.editRule')}
            styles={{marginBottom: 10}}
          />

          <View style={FormModalStyle.serviceViewStyle}>
            <View style={FormModalStyle.textAreaContainer}>
              <TextInput
                style={FormModalStyle.textArea}
                underlineColorAndroid="transparent"
                placeholder="Type something"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                value={description}
                onChangeText={val => {
                  setDescription(val);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditRuleModal;
