import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, NO_CONTENT } from 'http-status-codes';

import ReminderCategoryDao from '@daos/reminder-category-dao';
import { paramMissingError } from '@shared/constants';
import ReminderCategory from '@entities/reminder-category';

const router = Router();
const reminderCategoryDao = new ReminderCategoryDao();

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const reminderCategory = await reminderCategoryDao.get(+id);
  return res.status(OK).json({ 'reminder-category': reminderCategory });
});

router.get('/', async (req: Request, res: Response) => {
  const reminderCategories = await reminderCategoryDao.getCollection();
  return res.status(OK).json({ 'reminder-categories': reminderCategories });
});

router.post('/', async (req: Request, res: Response) => {
  const reminderCategory = req.body['reminder-category'];
  if (!reminderCategory) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await reminderCategoryDao.create(new ReminderCategory(reminderCategory));
  return res.status(CREATED).end();
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await reminderCategoryDao.delete(+id);
  return res.status(NO_CONTENT).end();
});

export default router;
