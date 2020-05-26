import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from 'http-status-codes';

import ReminderCategoryDao from '@daos/reminder-category-dao';
import { paramMissingError } from '@shared/constants';
import ReminderCategory from '@entities/reminder-category';

const router = Router();
const reminderCategoryDao = new ReminderCategoryDao();

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const reminder = await reminderCategoryDao.get(+id);
  return res.status(OK).json({ reminder });
});

router.get('/', async (req: Request, res: Response) => {
  const reminders = await reminderCategoryDao.getCollection();
  return res.status(OK).json({ reminders });
});

router.post('/', async (req: Request, res: Response) => {
  const { reminder } = req.body;
  if (!reminder) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await reminderCategoryDao.create(new ReminderCategory(reminder));
  return res.status(CREATED).end();
});

// router.put('/update', async (req: Request, res: Response) => {
//   const { reminder } = req.body;
//   if (!reminder) {
//     return res.status(BAD_REQUEST).json({
//       error: paramMissingError,
//     });
//   }
//   reminder.id = Number(reminder.id);
//   await reminderCategoryDao.update(reminder);
//   return res.status(OK).end();
// });

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await reminderCategoryDao.delete(+id);
  return res.status(NO_CONTENT).end();
});

export default router;
