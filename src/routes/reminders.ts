import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from 'http-status-codes';

import ReminderDao from '@daos/reminder-dao';
import { paramMissingError } from '@shared/constants';
import Reminder from '@entities/reminder';

const router = Router();
const reminderDao = new ReminderDao();

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const reminder = await reminderDao.get(+id);
  return res.status(OK).json({ reminder });
});

router.get('/', async (req: Request, res: Response) => {
  const query = req.query || {};
  const reminders = await reminderDao.getCollection(query);
  return res.status(OK).json({ reminders });
});

router.post('/', async (req: Request, res: Response) => {
  const { reminder } = req.body;
  if (!reminder) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await reminderDao.create(new Reminder(reminder));
  return res.status(CREATED).json({ reminder });
});

router.put('/:id/mark-done', async (req: Request, res: Response) => {
  const { id } = req.params;
  const reminder = await reminderDao.markDone(+id);
  return res.status(OK).json({ reminder });
});

// router.put('/update', async (req: Request, res: Response) => {
//   const { reminder } = req.body;
//   if (!reminder) {
//     return res.status(BAD_REQUEST).json({
//       error: paramMissingError,
//     });
//   }
//   reminder.id = Number(reminder.id);
//   await reminderDao.update(reminder);
//   return res.status(OK).end();
// });

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await reminderDao.delete(+id);
  return res.status(NO_CONTENT).end();
});

export default router;
