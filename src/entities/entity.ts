export interface Entity {
  toPostgres(): Array<any>;
  toPostgresColumns(): Array<string>;
}
