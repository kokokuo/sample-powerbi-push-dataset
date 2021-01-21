import {
  DatasetResult,
  DatasetCommand,
  DeleteDatasetResult,
  UpdatedDatasetResult,
  RebindDatasetResult
} from "../datacontracts";
import {
  postDatasetInGroup,
  addRowToDatasetInGroup,
  deleteDatasetInGroup,
  getReportsInGroup,
  ReportResult,
  rebindReportInGroup,
} from "../../powerbi";

type RebindReportResult = {
  code: number;
  message: string;
  reportId: string;
};

export interface IPowerBIDatasetService {
  createDataset(command: DatasetCommand): Promise<DatasetResult>;
  deleteDataset(datasetId: string): Promise<DeleteDatasetResult>;
  updateDataset(datasetId: string, command: DatasetCommand):Promise<UpdatedDatasetResult>; 
  rebindDatasetToReports(datasetId: string, command: DatasetCommand): Promise<RebindDatasetResult>;
}

export class PowerBIDatasetService implements IPowerBIDatasetService {
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

  public async createDataset(command: DatasetCommand) {
    const createResult = await postDatasetInGroup({
      accessToken: this.accessToken,
      groupId: this.groupId,
      data: {
        name: command.table,
        columns: command.columns,
      },
    });
    // Add Initialized Data Row
    const addRowResult = await addRowToDatasetInGroup({
      accessToken: this.accessToken,
      groupId: this.groupId,
      datasetId: createResult.datasetId,
      data: {
        table: createResult.table,
        rows: command.rows,
      },
    });

    return {
      datasetCreated: createResult.message,
      firstRowAdded: addRowResult.message,
      data: {
        datasetId: createResult.datasetId,
        table: createResult.table,
      },
    };
  }

  public async deleteDataset(datasetId: string) {
    // Deleted datasets by specific table
    const deleteResult = await deleteDatasetInGroup({
      accessToken: this.accessToken,
      groupId: this.groupId,
      datasetId: datasetId,
    });
    return {
      datasetId: datasetId,
      code: deleteResult.code,
      message: deleteResult.message,
    };
  }

  public async updateDataset(
    datasetId: string,
    command: DatasetCommand) {
    // 1. Create Dataset
    const createResult = await this.createDataset(command);
    // 2. Delete Dataset
    const deleteResult = await this.deleteDataset(datasetId);

    // Prepare response
    return {
      originalDatasetDeleted: deleteResult.message,
      ...createResult,
    };
  }

  public async rebindDatasetToReports(
    datasetId: string,
    command: DatasetCommand
  ) {
    // 1. Create Dataset
    const createResult = await this.createDataset(command);
    
    // 2. Check if report need to rebind or not and rebind it
    const rebindResults = await this.rebindReport({
      originalDatasetId: datasetId,
      datasetId: createResult.data.datasetId
    });
    // 3. Delete Dataset
    const deleteResult = await this.deleteDataset(datasetId);

    // Prepare response
    return {
      originalDatasetDeleted: deleteResult.message,
      reportsRebound: rebindResults.map(result => { 
        return {
          message: result.message,
          reportId: result.reportId
        }
      }),
      ...createResult,
    };
  }

  private async rebindReport({
    originalDatasetId,
    datasetId,
  }: {
    originalDatasetId: string;
    datasetId: string;
  }) {
    // 1. Get Reports
    const reports = await getReportsInGroup({
      accessToken: this.accessToken,
      groupId: this.groupId,
    });
    // 2. Find relative dataset report
    const originalDatasetReports = (reports.data as Array<ReportResult>).filter(
      (report) => report.datasetId === originalDatasetId
    );

    // 3. Rebind new dataset on it
    let rebindResults: Array<RebindReportResult> = [];
    for (const report of originalDatasetReports) {
      const response = await rebindReportInGroup({
        accessToken: this.accessToken,
        groupId: this.groupId,
        reportId: report.id,
        newDatasetId: datasetId,
      });
      rebindResults.push({
        code: response.code,
        message: response.message,
        reportId: report.id,
      });
    }
    return rebindResults;
  }
}
