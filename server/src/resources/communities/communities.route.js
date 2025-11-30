import { Router } from 'express';
import {
  allCommunes, createCommune, oneCommune, deleteCommune, getSearch,
} from './communities.controller';

const router = Router();

router.route('/search/get')
  .get(getSearch);

router.route('/all')
  .get(allCommunes);

router.route('/')
  .post(createCommune);

router.route('/:id')
  .get(oneCommune)
  .delete(deleteCommune);

export default router;
