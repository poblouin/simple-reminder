import moment from 'moment';

import logger from '@shared/logger';
import ReminderRecurrenceDao from '@daos/reminder-recurrence-dao';
import ReminderDao from './daos/reminder-dao';
import Reminder from '@entities/reminder';
import ReminderRecurrence from '@entities/reminder-recurrence';

export const processRecurrences = async () => {
  const reminderRecurrenceDao = new ReminderRecurrenceDao();
  const reminderDao = new ReminderDao();

  const recurrences = await reminderRecurrenceDao.getCollection();
  const nowUtc = moment.utc();
  recurrences.forEach(async r => {
    const lastReminderUtc = moment(r.reminder.dueTimestampUtc);
    let nextReminderUtc;

    if (r.frequency === 'daily') {
      nextReminderUtc = lastReminderUtc.add(1, 'd');
    } else if (r.frequency === 'weekly' && moment(lastReminderUtc).add(1, 'w').day() === nowUtc.day()) {
      nextReminderUtc = lastReminderUtc.add(1, 'w');
    } else if (r.frequency === 'bi-weekly' && moment(lastReminderUtc).add(2, 'w').day() === nowUtc.day()) {
      nextReminderUtc = lastReminderUtc.add(2, 'w');
    } else if (r.frequency === 'monthly' && moment(lastReminderUtc).add(1, 'M').day() === nowUtc.day()) {
      nextReminderUtc = lastReminderUtc.add(1, 'M');
    } else {
      logger.error(`No frequency for recurrence: ${r}`);
    }

    if (!nextReminderUtc) {
      return;
    }

    const newReminder = await reminderDao.create(new Reminder({
      ...r.reminder,
      dueTimestampUtc: nextReminderUtc,
    }));

    reminderRecurrenceDao.update(new ReminderRecurrence({
      ...r,
      reminder: newReminder,
    }));
  })
}
