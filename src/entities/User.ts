import snakeCase from 'lodash.snakecase';

import { Entity } from '@entities/entity';

interface User {
  id: number;
  userName: string;
  email: string;
  phone: string;
}

class User implements User, Entity {
  public id: number;

  public userName: string;

  public email: string;

  public phone: string;

  constructor(user: any) {
    this.userName = user.userName;
    this.email = user.email;
    this.phone = user.phone;
    this.id = user.id || -1;
  }

  public toPostgres(): Array<any> {
    return [this.userName, this.email, this.phone];
  }

  public toPostgresColumns(): Array<string> {
    return Object.keys(this)
      .filter((k) => k !== 'id')
      .map((k) => snakeCase(k));
  }
}

export default User;
