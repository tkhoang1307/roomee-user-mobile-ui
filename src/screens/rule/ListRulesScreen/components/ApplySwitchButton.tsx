import {View, Alert} from 'react-native';
import {Switch} from '@ant-design/react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';

import {ruleService} from '@services';
import {DetailRuleModel} from '@models/rule';
import {ErrorResponseAxios} from '@models/error';
import {SwitchButtonStyles} from '../styles';

interface ApplySwitchButtonProps {
  accommodationId: string;
  rule: DetailRuleModel;
  setListRules: React.Dispatch<React.SetStateAction<Array<DetailRuleModel>>>;
  disable?: boolean;
}

const ApplySwitchButton: React.FC<ApplySwitchButtonProps> = ({
  accommodationId,
  rule,
  setListRules,
  disable,
}) => {
  const {t} = useTranslation();

  const handleApplyAccount = async () => {
    try {
      const payload = {
        accommodationId: accommodationId,
        applied: !rule.applied,
      };

      const resDataApplyRule = await ruleService.updateAppliedRule(
        rule.id,
        payload,
      );
      if (resDataApplyRule !== undefined || resDataApplyRule !== null) {
        setListRules(prevRules => {
          const updatedRuleIndex = prevRules.findIndex(u => u.id === rule.id);
          if (updatedRuleIndex !== -1) {
            const updatedRules = [...prevRules];
            updatedRules[updatedRuleIndex] = {
              ...updatedRules[updatedRuleIndex],
              applied: !rule.applied,
            };
            return updatedRules;
          }
          return prevRules;
        });
      }
    } catch (error) {
      Alert.alert(
        t(`alertTitle.noti`),
        (error as ErrorResponseAxios).response.data.message,
      );
    } finally {
    }
  };

  return (
    <View style={SwitchButtonStyles.switchContainer}>
      <Switch
        disabled={disable}
        checked={rule.applied}
        onChange={handleApplyAccount}
        style={
          rule.applied
            ? SwitchButtonStyles.toggleCheckStyle
            : SwitchButtonStyles.toggleClosedStyle
        }
      />
    </View>
  );
};

export default ApplySwitchButton;
