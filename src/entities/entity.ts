export interface Entity {
  toPostgres(): Array<string>;
  toPostgresColumns(): Array<string>;
}
