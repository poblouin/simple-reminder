import snakeCase from 'lodash.snakecase';

import { Entity } from '@entities/entity';
import Reminder from './reminder';

interface ReminderRecurrence {
  frequency: string;
  untilUtc: Date;
  reminder: Reminder;
  [key: string]: ReminderRecurrence[keyof ReminderRecurrence];
}

class ReminderRecurrence implements ReminderRecurrence, Entity {
  public id: number;

  public frequency: string;

  public untilUtc: Date;

  constructor(reminderRecurrence: any) {
    this.id = reminderRecurrence.id || -1;
    this.frequency = reminderRecurrence.frequency;
    this.untilUtc = new Date(reminderRecurrence.untilUtc) || null;
    this.reminder = reminderRecurrence.reminder || null;
  }

  public toPostgres(): Array<any> {
    return [this.frequency, this.untilUtc, ...(this.reminder !== null ? [this.reminder.id || this.reminder] : []),];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this)
      .filter((k) => k !== 'id' && this[k] !== null)
      .map((k) => snakeCase(k));
  }
}

export default ReminderRecurrence;
