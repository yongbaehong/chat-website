import { Router } from 'express';
import { allDmMsgs, unseenMsgs } from './direct_msg.controller';

const router = Router();

router.route('/:user1/:user2')
  .get(allDmMsgs);

router.route('/:user')
  .get(unseenMsgs);

export default router;
