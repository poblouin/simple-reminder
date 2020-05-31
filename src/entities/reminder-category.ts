import snakeCase from 'lodash.snakecase';

import { Entity } from '@entities/entity';

interface ReminderCategory {
  id: number;
  categoryName: string;
  color: string;
}

class ReminderCategory implements ReminderCategory, Entity {
  public id: number;

  public categoryName: string;

  public color: string;

  constructor(reminderCatgegory: any) {
    this.categoryName = reminderCatgegory.categoryName;
    this.color = reminderCatgegory.color;
    this.id = reminderCatgegory.id || -1;
  }

  public toPostgres(): Array<any> {
    return [this.categoryName, this.color];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this)
      .filter((k) => k !== 'id')
      .map((k) => snakeCase(k));
  }
}

export default ReminderCategory;
