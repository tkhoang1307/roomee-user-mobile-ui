import { privateAxios } from '@libs/axios';
import { RuleEndPoints } from '@const/rule';
import { DetailRuleModel, CreationRuleModel, UpdationRuleModel, UpdationAppliedRuleModel } from '@models/rule';

export const getAllRulesOfAccommodation = async (accommodationId: string) => {
    const res = await privateAxios.get(RuleEndPoints.GET_ALL_RULES_IN_ACCOMMODATION + accommodationId);
    return res.data as Array<DetailRuleModel>;
}

export const getRuleByRuleId = async (ruleId: string) => {
    const res = await privateAxios.get(RuleEndPoints.GET_UPDATE_RULE_BY_RULEID + ruleId);
    return res.data as DetailRuleModel;
}

export const createNewRuleForAccommodation = async (payload: CreationRuleModel) => {
    const res = await privateAxios.post(RuleEndPoints.CREATE_NEW_RULE, payload);
    return res.data as DetailRuleModel;
}

export const updateTheDescriptionOfRule = async (ruleId: string, payload: UpdationRuleModel) => {
    const res = await privateAxios.put(RuleEndPoints.GET_UPDATE_RULE_BY_RULEID + ruleId, payload);
    return res.data as DetailRuleModel;
}

export const updateAppliedRule = async (ruleId: string, payload: UpdationAppliedRuleModel) => {
    const res = await privateAxios.put(RuleEndPoints.APPLY_RULE + ruleId, payload);
    return res.data as DetailRuleModel;
}