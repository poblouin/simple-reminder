import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from 'http-status-codes';

import ReminderRecurrenceDao from '@daos/reminder-recurrence-dao';
import { paramMissingError } from '@shared/constants';
import ReminderRecurrence from '@entities/reminder-recurrence';

const router = Router();
const reminderRecurrenceDao = new ReminderRecurrenceDao();

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const reminderRecurrence = await reminderRecurrenceDao.get(+id);
  return res.status(OK).json({ 'reminder-recurrence': reminderRecurrence });
});

router.get('/', async (req: Request, res: Response) => {
  const reminderRecurrences = await reminderRecurrenceDao.getCollection();
  return res.status(OK).json({ 'reminder-recurrences': reminderRecurrences });
});

router.post('/', async (req: Request, res: Response) => {
  const reminderRecurrence = req.body['reminder-recurrence'];
  if (!reminderRecurrence) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await reminderRecurrenceDao.create(new ReminderRecurrence(reminderRecurrence));
  return res.status(CREATED).end();
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await reminderRecurrenceDao.delete(+id);
  return res.status(NO_CONTENT).end();
});

export default router;
