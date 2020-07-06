import ReminderRecurrence from '@entities/reminder-recurrence';
import Dao from '@daos/dao';
import ReminderDao from './reminder-dao';


class ReminderRecurrenceDao extends Dao<ReminderRecurrence> {
  constructor() {
    super('reminder_recurrence');
  }

  // TODO: Single DB call for performance
  private async augmentRecurrenceCollection(recurrences: Array<ReminderRecurrence>): Promise<Array<ReminderRecurrence>> {
    const reminderDao = new ReminderDao();
    const returnRecurrences = Array<ReminderRecurrence>();

    await recurrences.reduce(async (promise, recurrence) => {
      await promise;

      const reminder = await reminderDao.get(recurrence.reminder);

      returnRecurrences.push(
        new ReminderRecurrence({
          ...recurrence,
          reminder,
        })
      );
    }, Promise.resolve());

    return returnRecurrences;
  }

  async getCollection(): Promise<Array<ReminderRecurrence>> {
    const recurrences = await super.getCollection();

    return this.augmentRecurrenceCollection(recurrences);
  }
}

export default ReminderRecurrenceDao;
