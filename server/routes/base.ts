import express from 'express';
import { ret } from '../utils';

const router = express.Router();

/** test1 */
router.get('/test1', async (req, res, next) => {
  try {
    const { source, msg, stack, agent, size } = req.query;
    ret(res, 123);
  } catch (err) {
    next(err);
  }
});

/** test2 */
router.post('/test2', async (req, res, next) => {
  try {
    const { content, name } = req.body;
    ret(res, 456);
  } catch (err) {
    next(err);
  }
});

/** 修改配置 */
router.post('/chenge-setting', async (req, res, next) => {
  try {
    const { key, value } = req.body;

    ret(res, true);
  } catch (err) {
    next(err);
  }
});

export default router;
