import Reminder from '@entities/reminder';
import ReminderCategory from '@entities/reminder-category';
import Dao from '@daos/dao';
import ReminderCategoryDao from '@daos/reminder-category-dao';

class ReminderDao extends Dao<Reminder> {
  private reminderCategoryDao = new ReminderCategoryDao();

  constructor() {
    super('reminder');
  }

  async get(value: any, column = this.pkeyName): Promise<Reminder> {
    const reminder = await super.get(value, column);

    if (reminder.category) {
      const reminderCategory = await this.reminderCategoryDao.get(reminder.category);
      reminder.category = reminderCategory;
    }

    return reminder;
  }

  async getCollection(): Promise<Array<Reminder>> {
    const reminders = await super.getCollection();
    const returnReminders = Array<Reminder>();

    await reminders.reduce(async (promise, reminder) => {
      await promise;

      let reminderCategory = {};

      if (reminder.category) {
        reminderCategory = await this.reminderCategoryDao.get(reminder.category);
      }

      returnReminders.push(
        new Reminder({
          ...reminder,
          ...{ category: reminderCategory },
        })
      );
    }, Promise.resolve());

    return returnReminders;
  }

  async create(reminder: Reminder): Promise<Reminder> {
    if (reminder.category) {
      let category;

      if (reminder.category.id) {
        category = await this.reminderCategoryDao.get(reminder.category.id);
      }

      if (!category || category.categoryName !== reminder.category.categoryName) {
        await this.reminderCategoryDao.create(new ReminderCategory(reminder.category));
      }
    }

    return super.create(reminder);
  }

  async markDone(id: number): Promise<Reminder> {
    const reminder = await super.get(id);
    if (!reminder) {
      throw new Error('NOT FOUND');
    }

    reminder.isDone = true;
    const updatedReminder = await super.update(new Reminder(reminder));

    if (updatedReminder.category) {
      const reminderCategory = await this.reminderCategoryDao.get(updatedReminder.category);
      updatedReminder.category = reminderCategory;
    }

    return updatedReminder;
  }
}

export default ReminderDao;
