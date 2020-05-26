import query from '@db';
import logger from '@shared/logger';
import { Entity } from '@entities/entity';

const wrapper = (p: Promise<any>) =>
  p
    .then((result: any) => ({ result, error: null }))
    .catch((error: Error) => ({ error, result: null }));

abstract class Dao<E extends Entity> {
  readonly tableName: string;

  readonly pkeyName: string;

  constructor(tableName: string, pkeyName = 'id') {
    this.tableName = tableName;
    this.pkeyName = pkeyName;
  }

  async get(value: any, column = this.pkeyName): Promise<E | null> {
    const { result, error } = await wrapper(
      query(`SELECT * from public.${this.tableName} WHERE ${column} = ${value};`)
    );

    if (error) {
      logger.error(error);
      return null;
    }

    return result.rows[0];
  }

  async getCollection(): Promise<Array<E> | null> {
    const { result, error } = await wrapper(query(`SELECT * from public.${this.tableName};`));

    if (error) {
      logger.error(error);
      return null;
    }

    return result.rows;
  }

  async create(e: E): Promise<E | null> {
    const { result, error } = await wrapper(
      query(
        `INSERT INTO public.${this.tableName} (${e
          .toPostgresColumns()
          .reduce(
            (acc, current, index, arr) => `${acc}${current}${index === arr.length - 1 ? '' : ','}`,
            ''
          )}) VALUES (${e
          .toPostgres()
          .reduce(
            (acc, _, index, arr) => `${acc}$${index + 1}${index === arr.length - 1 ? '' : ','}`,
            ''
          )}) RETURNING *;`,
        e.toPostgres()
      )
    );

    if (error) {
      logger.error(error);
      return null;
    }

    return result.rows[0];
  }

  // async update(e: E): Promise<E> {
  //   throw new Error('Not Implemented');
  // }

  async delete(id: number): Promise<boolean> {
    const { error } = await wrapper(query(`DELETE from ${this.tableName} WHERE id = ${id};`));

    if (error) logger.error(error);
    return error !== null;
  }
}

export default Dao;
