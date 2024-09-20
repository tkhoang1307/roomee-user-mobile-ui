import {View, Alert, TextInput} from 'react-native';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Modal} from '@ant-design/react-native';

import {ruleService} from '@services';
import {DetailRuleModel} from '@models/rule';
import {ErrorResponseAxios} from '@models/error';
import {TextComponent} from '@components/index';
import {appColors} from '@const/appColors';
import {FormModalStyle} from '../styles';

interface AddRuleModalProps {
  accommoadationId: string;
  listRules: Array<DetailRuleModel>;
  setListRules: React.Dispatch<React.SetStateAction<Array<DetailRuleModel>>>;
  isOpenAddModal: boolean;
  setIsOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddRuleModal: React.FC<AddRuleModalProps> = ({
  accommoadationId,
  listRules,
  setListRules,
  isOpenAddModal,
  setIsOpenAddModal,
}) => {
  const {t} = useTranslation();
  const [description, setDescription] = useState<string>('');

  const handleAddNewRule = async () => {
    try {
      if (!description) {
        Alert.alert(t(`alertTitle.noti`), t(`alertContent.fillNotEnough`));
        return;
      }

      const payload = {
        description: description,
        applied: true,
        accommodationId: accommoadationId,
      };

      const resData = await ruleService.createNewRuleForAccommodation(payload);
      setListRules([...listRules, resData]);
    } catch (error: any) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
    }

    setDescription('');
    setIsOpenAddModal(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpenAddModal}
      maskClosable
      onClose={() => setIsOpenAddModal(false)}
      footer={[
        {
          text: t('actions.cancel'),
          onPress: () => {},
          style: {color: appColors.danger},
        },
        {
          text: t('actions.addRule'),
          onPress: () => handleAddNewRule(),
          style: {color: appColors.primary},
        },
      ]}>
      <View style={{width: '110%'}}>
        <View style={{width: '90%'}}>
          <TextComponent
            text={t('actions.addRule')}
            styles={{marginBottom: 10}}
          />

          <View style={FormModalStyle.serviceViewStyle}>
            <View style={FormModalStyle.textAreaContainer}>
              <TextInput
                style={FormModalStyle.textArea}
                underlineColorAndroid="transparent"
                placeholder="..."
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

export default AddRuleModal;
