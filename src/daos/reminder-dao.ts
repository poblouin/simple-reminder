import Reminder from '@entities/reminder';
import Dao from '@daos/dao';

class ReminderDao extends Dao<Reminder> {
  constructor() {
    super('reminder');
  }
}

export default ReminderDao;
