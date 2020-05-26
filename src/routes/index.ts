import { Router } from 'express';
import UserRouter from './users';
import ReminderRouter from './reminders';
import ReminderCategoriesRouter from './reminder-caregories';

const router = Router();

router.use('/users', UserRouter);
router.use('/reminders', ReminderRouter);
router.use('/reminder-categories', ReminderCategoriesRouter);

export default router;
