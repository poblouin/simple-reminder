import User from '@entities/user';
import Dao from '@daos/dao';

class UserDao extends Dao<User> {
  constructor() {
    super('reminder_user');
  }
}

export default UserDao;
