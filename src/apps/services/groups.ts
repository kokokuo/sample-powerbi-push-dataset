import { ListGroupResult } from "../datacontracts";
import { getGroups } from "../../powerbi";

export interface IPowerBIGroupsService {
  listGroups(): Promise<ListGroupResult>;
}

export class PowerBIGroupService implements IPowerBIGroupsService {
  private accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  public async listGroups() {
    const result = await getGroups(this.accessToken);

    return {
      code: result.code,
      message: result.message,
      data: result.data.map((group) => {
        return {
          groupId: group.id,
          name: group.name,
        };
      }),
    };
  }
}
