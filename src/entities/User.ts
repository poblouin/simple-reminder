import { Entity } from '@entities/entity';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

class User implements User, Entity {
  public id: number;

  public name: string;

  public email: string;

  public phone: string;

  constructor(name: string, email: string, phone: string, id?: number) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.id = id || -1;
  }

  public toPostgres(): Array<string> {
    return [this.name, this.email, this.phone];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this).filter((k) => k !== 'id');
  }
}

export default User;
