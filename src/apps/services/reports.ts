import { ListReportResult, RebindResult, RebindCommand } from "../datacontracts";
import { getReportsInGroup, rebindReportInGroup } from "../../powerbi";

export interface IPowerBIReportService {
  listReports(): Promise<ListReportResult>;
  rebindSpecificReport(command: RebindCommand): Promise<RebindResult>;
}

export class PowerBIReportService implements IPowerBIReportService {
  private accessToken: string;
  private groupId: string;

  constructor({
    accessToken,
    groupId,
  }: {
    accessToken: string;
    groupId: string;
  }) {
    this.accessToken = accessToken;
    this.groupId = groupId;
  }
  public async listReports() {
    const result = await getReportsInGroup({
      accessToken: this.accessToken,
      groupId: this.groupId,
    });
    return {
      code: result.code,
      message: result.message,
      data: result.data.map(report => {
        return {
          name: report.name,
          reportId: report.id,
          datasetId: report.datasetId
        }
      }),
    };
  }

  public async rebindSpecificReport(command: RebindCommand) {
    const result = await rebindReportInGroup({
      accessToken: this.accessToken,
      groupId: this.groupId,
      reportId: command.reportId,
      newDatasetId: command.datasetId,
    });
    return {
      code: result.code,
      message: result.message,
    };
  }
}
