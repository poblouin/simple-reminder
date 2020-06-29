import snakeCase from 'lodash.snakecase';

import { Entity } from '@entities/entity';
import ReminderCategory from './reminder-category';
import User from './user';

interface Reminder {
  reminderName: string;
  description: string;
  isDone: boolean;
  dueTimestampUtc: Date;
  category: ReminderCategory;
  reminderUser: User;
  [key: string]: Reminder[keyof Reminder];
}

class Reminder implements Reminder, Entity {
  public id: number;

  public reminderName: string;

  /**
   * @property
   * Unix Timestamp
   */
  public description: string;

  public isDone: boolean;

  public dueTimestampUtc: Date;

  public category: ReminderCategory;

  public reminderUser: User;

  constructor(reminder: any) {
    this.reminderName = reminder.reminderName;
    this.description = reminder.description;
    this.isDone = reminder.isDone || false;
    this.dueTimestampUtc = new Date(reminder.dueTimestampUtc);
    this.category = reminder.category || null;
    this.reminderUser = reminder.reminderUser || null;
    this.id = reminder.id || -1;
  }

  public toPostgres(): Array<any> {
    return [
      this.reminderName,
      this.description,
      this.isDone,
      this.dueTimestampUtc,
      ...(this.category !== null ? [this.category.id || this.category] : []),
      ...(this.reminderUser !== null ? [this.reminderUser.id || this.reminderUser] : []),
    ];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this)
      .filter((k) => k !== 'id' && this[k] !== null)
      .map((k) => snakeCase(k));
  }
}

export default Reminder;
