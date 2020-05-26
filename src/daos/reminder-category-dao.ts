import ReminderCategory from '@entities/reminder-category';
import Dao from '@daos/dao';

class ReminderCategoryDao extends Dao<ReminderCategory> {
  constructor() {
    super('reminder_category');
  }
}

export default ReminderCategoryDao;
