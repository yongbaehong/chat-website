import { Router } from 'express';
import {
  createUser, getUser,
  loginUser, logoutUser,
  authError, authZUser,
  updateUserAvatar,
  matchedUsers, prefFilter,
  unseenUserMsgs,
  deleteUser, addOrRemoveFriend,
} from './user.controller';
import { ensureAuth, passportAuthenticate } from '../../auth/passport';

const router = Router();

router.route('/signup')
  .post([createUser, passportAuthenticate], loginUser);

router.route('/login')
  .post(passportAuthenticate, loginUser);

router.route('/delete-user')
  .delete(deleteUser);

router.route('/api/preference/filter')
  .post(ensureAuth, prefFilter);

router.route('/api/matched/users/:id')
  .get(ensureAuth, matchedUsers);

router.route('/api/unseen-user-messages/:id')
  .get(ensureAuth, unseenUserMsgs);

router.route('/api/user')
  .get(ensureAuth, getUser);

router.route('/logout')
  .get(logoutUser);

router.route('/error')
  .get(authError);

router.route('/api/user/:id/avatar')
  .put(ensureAuth, updateUserAvatar);

router.route('/api/friend/:friendid/:op/:id')
  .put(ensureAuth, addOrRemoveFriend);

export default router;
