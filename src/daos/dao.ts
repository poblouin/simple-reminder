import camelCase from 'lodash.camelcase';

import query from '@db';
import logger from '@shared/logger';
import { Entity } from '@entities/entity';
import { toPostgresColumnStatement, toPostgresValuesStatement } from '@shared/functions';

const wrapper = (p: Promise<any>): Promise<any> =>
  p
    .then((result: any) => ({ result, error: null }))
    .catch((error: Error) => ({ error, result: null }));

const processError = (err: Error | null): void => {
  if (err) {
    logger.error(err);
    throw err;
  }
};

const toCamelCase = (o: { [key: string]: string }): object => {
  return Object.assign({}, ...Object.keys(o).map((k) => ({ [camelCase(k)]: o[k] })));
};

abstract class Dao<E extends Entity> {
  readonly tableName: string;

  readonly pkeyName: string;

  constructor(tableName: string, pkeyName = 'id') {
    this.tableName = tableName;
    this.pkeyName = pkeyName;
  }

  async get(value: any, column = this.pkeyName): Promise<E> {
    const queryStr = `SELECT * from public.${this.tableName} WHERE ${column} = $1;`;

    const { result, error } = await wrapper(query(queryStr, [value]));

    processError(error);

    return toCamelCase(result.rows[0]) as E;
  }

  async getCollection(queryStr?: string, paramValues?: any): Promise<Array<E>> {
    const defaultQueryStr = queryStr || `SELECT * from public.${this.tableName};`;
    const { result, error } = await wrapper(query(defaultQueryStr, paramValues));

    processError(error);

    return result.rows.map((r: { [key: string]: string }) => toCamelCase(r)) as Array<E>;
  }

  async create(e: E): Promise<E> {
    const queryStr = `INSERT INTO public.${this.tableName} (${toPostgresColumnStatement(
      e.toPostgresColumns()
    )}) VALUES (${toPostgresValuesStatement(e.toPostgres())}) RETURNING *;`;

    const { result, error } = await wrapper(query(queryStr, e.toPostgres()));

    processError(error);

    return toCamelCase(result.rows[0]) as E;
  }

  async update(e: E): Promise<E> {
    const queryStr = `UPDATE public.${this.tableName} SET (${toPostgresColumnStatement(
      e.toPostgresColumns()
    )}) = (${toPostgresValuesStatement(e.toPostgres())})
    WHERE ${this.pkeyName} = ${e[this.pkeyName]} RETURNING *;`;

    const { result, error } = await wrapper(query(queryStr, e.toPostgres()));

    processError(error);

    return toCamelCase(result.rows[0]) as E;
  }

  async delete(id: number): Promise<void> {
    const queryStr = `DELETE from public.${this.tableName} WHERE id = $1;`;

    const { error } = await wrapper(query(queryStr, [id]));

    processError(error);
  }
}

export default Dao;
