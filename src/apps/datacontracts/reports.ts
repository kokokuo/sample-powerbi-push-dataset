
export interface RebindCommand {
  reportId: string;
  datasetId: string;
}

export interface ReportResult {
  name: string;
  reportId: string;
  datasetId: string;
}

export interface ListReportResult {
  code: number;
  message: string;
  data: Array<ReportResult>;
}


export interface RebindResult {
  code: number;
  message: string;
}
