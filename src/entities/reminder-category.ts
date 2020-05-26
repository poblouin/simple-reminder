import { Entity } from '@entities/entity';

interface ReminderCategory {
  id: number;
  name: string;
  color: string;
}

class ReminderCategory implements ReminderCategory, Entity {
  public id: number;

  public name: string;

  public color: string;

  constructor(reminderCatgegory: any) {
    this.name = reminderCatgegory.name;
    this.color = reminderCatgegory.description;
    this.id = reminderCatgegory.id || -1;
  }

  public toPostgres(): Array<any> {
    return [this.name, this.color];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this).filter((k) => k !== 'id');
  }
}

export default ReminderCategory;
