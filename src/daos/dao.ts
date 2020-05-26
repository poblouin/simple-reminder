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

abstract class Dao<E extends Entity> {
  readonly tableName: string;

  readonly pkeyName: string;

  constructor(tableName: string, pkeyName = 'id') {
    this.tableName = tableName;
    this.pkeyName = pkeyName;
  }

  async get(value: any, column = this.pkeyName): Promise<E | null> {
    const queryStr = `SELECT * from public.${this.tableName} WHERE ${column} = $1;`;

    const { result, error } = await wrapper(query(queryStr, [value]));

    processError(error);

    return result.rows[0];
  }

  async getCollection(): Promise<Array<E> | null> {
    const queryStr = `SELECT * from public.${this.tableName};`;

    const { result, error } = await wrapper(query(queryStr));

    processError(error);

    return result.rows;
  }

  async create(e: E): Promise<E | null> {
    const queryStr = `INSERT INTO public.${this.tableName} (${toPostgresColumnStatement(
      e.toPostgresColumns()
    )}) VALUES (${toPostgresValuesStatement(e.toPostgres())}) RETURNING *;`;

    const { result, error } = await wrapper(query(queryStr, e.toPostgres()));

    processError(error);

    return result.rows[0];
  }

  // async update(e: E): Promise<E> {
  //   throw new Error('Not Implemented');
  // }

  async delete(id: number): Promise<void> {
    const queryStr = `DELETE from public.${this.tableName} WHERE id = $1;`;

    const { error } = await wrapper(query(queryStr, [id]));

    processError(error);
  }
}

export default Dao;
