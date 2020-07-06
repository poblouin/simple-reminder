import { Router } from 'express';
import UserRouter from './users';
import ReminderRouter from './reminders';
import ReminderCategoriesRouter from './reminder-caregories';
import ReminderRecurrenceRouter from './reminder-recurrence';

const router = Router();

router.use('/users', UserRouter);
router.use('/reminders', ReminderRouter);
router.use('/reminder-categories', ReminderCategoriesRouter);
router.use('/reminder-recurrences', ReminderRecurrenceRouter);

export default router;
