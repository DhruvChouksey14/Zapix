export interface SelectedTrigger {
  availableTriggerId: string;
  triggerType: string;
  triggerMetaData?: Record<string, unknown>;
}

export interface SelectedAction {
  availableActionId: string;
  actionType: string;
  actionMetaData?: Record<string, unknown>;
}