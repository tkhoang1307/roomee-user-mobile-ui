export interface DetailRuleModel {
    id: string;
    creator: CreatorUpdaterModel;
    updater: CreatorUpdaterModel;
    createdAt: Date;
    updatedAt: string;
    description: string;
    applied: boolean;
}

export interface CreatorUpdaterModel {
    id: string;
    name: string;
}

export interface CreationRuleModel {
    description: string;
    accommodationId: string;
    applied: boolean;
}

export interface UpdationRuleModel {
    accommodationId: string;
    description: string;
}

export interface UpdationAppliedRuleModel {
    accommodationId: string;
    applied: boolean;
}