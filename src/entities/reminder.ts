import snakeCase from 'lodash.snakecase';

import { Entity } from '@entities/entity';

interface Reminder {
  id: number;
  name: string;
  description: string;
  isDone: boolean;
  dueTimestampUtc: Date;
  category: number;
  user: number;
  [key: string]: Reminder[keyof Reminder];
}

class Reminder implements Reminder, Entity {
  public id: number;

  public name: string;

  /**
   * @property
   * Unix Timestamp
   */
  public description: string;

  public isDone: boolean;

  public dueTimestampUtc: Date;

  public category: number;

  public user: number;

  constructor(reminder: any) {
    this.name = reminder.name;
    this.description = reminder.description;
    this.isDone = reminder.isDone || false;
    this.dueTimestampUtc = new Date(reminder.dueTimestampUtc * 1000);
    this.category = reminder.category || -1;
    this.user = reminder.user || -1;
    this.id = reminder.id || -1;
  }

  public toPostgres(): Array<any> {
    return [
      this.name,
      this.description,
      this.isDone,
      this.dueTimestampUtc,
      ...(this.user !== -1 ? [this.user] : []),
      ...(this.category !== -1 ? [this.category] : []),
    ];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this)
      .filter((k) => k !== 'id' && this[k] !== -1)
      .map((k) => snakeCase(k));
  }
}

export default Reminder;
