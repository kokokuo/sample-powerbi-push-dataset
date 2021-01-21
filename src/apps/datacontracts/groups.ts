export interface GroupResult {
  name: string;
  groupId: string;
}

export interface ListGroupResult {
  code: number;
  message: string;
  data: Array<GroupResult>;
}
