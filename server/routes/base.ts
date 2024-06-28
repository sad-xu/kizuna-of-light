import fs from 'fs';
import path from 'path';
import express from 'express';
import { ret } from '../utils';
import {
  randomDelay,
  getAllFollowsById,
  getAllFansById,
  UserInfo,
  checkIsSpidering,
  startSpider,
  addResCallback,
} from '../utils/spider';
import { Response } from 'express-serve-static-core';

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
router.post('/change-setting', async (req, res, next) => {
  try {
    const { key, value } = req.body;

    ret(res, true);
  } catch (err) {
    next(err);
  }
});

/*
[{
  target: ,
  follows: [],
  fans: []
}]
*/

/** 是否正在爬取 同一时刻只能有一个任务 */
let isSpidering = false;

/** 爬取粉丝和关注 */
router.get('/sse-spider', async (req, res, next) => {
  try {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.flushHeaders();

    addResCallback(res);

    if (checkIsSpidering()) {
      res.write(`event: occupied\ndata: true\n\n`);
    } else {
      const reqId = `${req.query.id}` || '10200500';
      startSpider(reqId);
    }
  } catch (err) {
    isSpidering = false;
    next(err);
  }
});

export default router;
