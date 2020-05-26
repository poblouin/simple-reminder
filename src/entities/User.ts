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

  constructor(user: any) {
    this.name = user.name;
    this.email = user.email;
    this.phone = user.phone;
    this.id = user.id || -1;
  }

  public toPostgres(): Array<any> {
    return [this.name, this.email, this.phone];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this).filter((k) => k !== 'id');
  }
}

export default User;
