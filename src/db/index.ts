import { Pool, QueryArrayResult } from 'pg';

import logger from '@shared/logger';

const pool = new Pool();

const query = (text: any, values?: any): Promise<QueryArrayResult<any[]>> => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`QUERY = ${text}${values ? `\nVALUES = ${values.toString()}` : ''}`);
  }

  return pool.query(text, values);
};

export default query;
