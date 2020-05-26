import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

import UserDao from '@daos/user-dao';
import { paramMissingError } from '@shared/constants';
import User from '@entities/user';

const router = Router();
const userDao = new UserDao();

router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userDao.get(+id);
  return res.status(OK).json({ user });
});

router.get('/', async (req: Request, res: Response) => {
  const users = await userDao.getCollection();
  return res.status(OK).json({ users });
});

router.post('/', async (req: Request, res: Response) => {
  const { user } = req.body;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await userDao.create(new User(user.name, user.email, user.phone));
  return res.status(CREATED).end();
});

// router.put('/update', async (req: Request, res: Response) => {
//   const { user } = req.body;
//   if (!user) {
//     return res.status(BAD_REQUEST).json({
//       error: paramMissingError,
//     });
//   }
//   user.id = Number(user.id);
//   await userDao.update(user);
//   return res.status(OK).end();
// });

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await userDao.delete(+id);
  return res.status(OK).end();
});

export default router;
