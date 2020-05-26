import { Pool, QueryArrayResult } from 'pg';

const pool = new Pool();

const query = (text: any, values?: any): Promise<QueryArrayResult<any[]>> =>
  pool.query(text, values);

export default query;
