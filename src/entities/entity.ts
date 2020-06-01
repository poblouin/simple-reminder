export interface Entity {
  toPostgres(): Array<any>;
  toPostgresColumns(): Array<string>;
  id: number;
  [key: string]: any;
}
