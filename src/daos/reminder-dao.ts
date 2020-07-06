/* eslint-disable @typescript-eslint/camelcase */

import moment from 'moment';

import Reminder from '@entities/reminder';
import ReminderCategory from '@entities/reminder-category';
import ReminderRecurrence from '@entities/reminder-recurrence';
import Dao from '@daos/dao';
import ReminderCategoryDao from '@daos/reminder-category-dao';
import ReminderRecurrenceDao from '@daos/reminder-recurrence-dao';
import UserDao from '@daos/user-dao';

class ReminderDao extends Dao<Reminder> {
  private reminderCategoryDao = new ReminderCategoryDao();
  private reminderRecurrenceDao = new ReminderRecurrenceDao();
  private userDao = new UserDao();

  constructor() {
    super('reminder');
  }

  // TODO: Single DB call for performance
  private async augmentReminderCollection(reminders: Array<Reminder>): Promise<Array<Reminder>> {
    const returnReminders = Array<Reminder>();

    await reminders.reduce(async (promise, reminder) => {
      await promise;

      let reminderCategory = null;
      let reminderUser = null;

      if (reminder.category) {
        reminderCategory = await this.reminderCategoryDao.get(reminder.category);
      }

      if (reminder.reminderUser) {
        reminderUser = await this.userDao.get(reminder.reminderUser);
      }

      returnReminders.push(
        new Reminder({
          ...reminder,
          ...{ category: reminderCategory },
          ...{ reminderUser: reminderUser },
        })
      );
    }, Promise.resolve());

    return returnReminders;
  }

  private getCollectionQueryStr(augmentedParams: any): string {
    let queryStr = `SELECT * from public.${this.tableName}`;

    if (augmentedParams && Object.keys(augmentedParams).length > 0) {
      queryStr = `${queryStr} WHERE`;

      let customIndex = 0;
      queryStr = Object.keys(augmentedParams).reduce((acc, current) => {
        let returnStr = `${acc}${customIndex === 0 ? '' : ' AND'}`;

        if (current === 'due_timestamp_utc') {
          returnStr = `${returnStr} ${current} BETWEEN TO_TIMESTAMP($${customIndex + 1}, 'YYYY-MM-DD HH24:MI:SS') AND TO_TIMESTAMP($${customIndex + 2}, 'YYYY-MM-DD HH24:MI:SS')`;
          customIndex += 2;
        } else {
          returnStr = `${returnStr} ${current} = $${customIndex + 1}`;
          customIndex += 1;
        }

        return returnStr;
      }, queryStr);
    }

    return `${queryStr};`;
  }

  // eslint-disable-next-line class-methods-use-this
  private getCollectionAugmentedParams(params: any): any {
    if (!params || Object.keys(params).length === 0) {
      return {};
    }

    let augmentedParams = {
      ...params,
    };

    Object.entries(params).forEach(([k, v]) => {
      if (k === 'period') {
        const due_timestamp_utc = {
          startTimestamp: '',
          endTimestamp: '',
        };

        if (v === 'today') {
          const nowUtc = moment.utc();
          due_timestamp_utc.startTimestamp = nowUtc.startOf('day').format('YYYY-MM-DD HH:mm:ss');
          due_timestamp_utc.endTimestamp = nowUtc.endOf('day').format('YYYY-MM-DD HH:mm:ss')
        }
        // TODO; week
        // TODO: month

        delete augmentedParams[k];
        augmentedParams = {
          ...augmentedParams,
          due_timestamp_utc,
        };
      }

      return null;
    });

    return augmentedParams;
  }

  async get(value: any, column = this.pkeyName): Promise<Reminder> {
    const reminder = await super.get(value, column);

    if (reminder.category) {
      const reminderCategory = await this.reminderCategoryDao.get(reminder.category);
      reminder.category = reminderCategory;
    }

    return reminder;
  }

  async getCollection(params?: any): Promise<Array<Reminder>> {
    const augmentedParams = this.getCollectionAugmentedParams(params);
    const queryValues = Object.values(augmentedParams).map(v => v && typeof v === 'object' ? Object.values(v) : v).flat();

    const reminders = await super.getCollection(
      this.getCollectionQueryStr(augmentedParams),
      queryValues
    );

    return this.augmentReminderCollection(reminders);
  }

  async create(reminder: Reminder): Promise<Reminder> {
    if (reminder.category) {
      let category;

      if (reminder.category.id) {
        category = await this.reminderCategoryDao.get(reminder.category.id);
      }

      if (!category || category.categoryName !== reminder.category.categoryName) {
        const newCategory = await this.reminderCategoryDao.create(new ReminderCategory(reminder.category));
        reminder = new Reminder({...reminder, ...{category: newCategory.id} });
      }
    }

    const newReminder = await super.create(reminder);

    if (reminder.recurrence) {
      const recurrence = await this.reminderRecurrenceDao.create(new ReminderRecurrence({
        ...reminder.recurrence,
        reminder: newReminder
      }));
      newReminder.recurrence = recurrence;
    }

    return newReminder;
  }

  async markDone(id: number): Promise<Reminder> {
    const reminder = await this.get(id);
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
