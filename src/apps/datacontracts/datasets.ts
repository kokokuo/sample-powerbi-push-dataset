

export type TableRow = {
  [key: string]: number | string | boolean;
};

export interface TableColumn {
  name: string;
  dataType: string;
}

export interface DatasetCommand {
  table: string;
  columns: Array<TableColumn>;
  rows: Array<TableRow>;
}

export interface DeleteDatasetResult {
    datasetId: string;
    code: number;
    message: string;
}

export interface DatasetResult {
  datasetCreated: string;
  firstRowAdded: string;
  data: {
    datasetId: string;
    table: string;
  };
}


export type UpdatedDatasetResult = DatasetResult & {
   originalDatasetDeleted: string;
};


export type RebindDatasetResult = UpdatedDatasetResult & {
  reportsRebound: Array<{
    message: string;
    reportId: string;
   }>;
}