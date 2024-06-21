import express from 'express';
import { ret } from '../utils';
import { randomDelay, getAllFollowsById, getAllFansById } from '../utils/spider';

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

/*
[{
  target: ,
  follows: [],
  fans: []
}]

*/

/** 爬取粉丝和关注 */
router.get('/sse-spider', async (req, res, next) => {
  try {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.flushHeaders();

    // 当前爬取深度 0我-1关注&粉丝-2关注&粉丝
    let depth = 0;
    const depthCount = [1, 1, 1];
    // 待爬取用户
    const uuidList = new Set();
    // 已记录用户
    const markedId = new Set();
    // 所有数据
    const allData = [];

    uuidList.add('10200500');

    // 获取目标用户的关注和粉丝
    for (let i = 0; i < uuidList.size; i++) {
      const id = uuidList[i];
      markedId.add(id);
      // 单个人爬取开始
      res.write(`event: partStart\ndata: ${i + 1}\n\n`);
      await getAllFollowsById(id, (d) => {
        // 每个接口的数据
        d.list.forEach((item) => {
          const nId = item.uuid;
          if (!markedId.has(nId)) {
            uuidList.add(nId);
          }
        });
        res.write(`event: follows\ndata: ${JSON.stringify(d)}\n\n`);
      });
      await getAllFansById(id, (d) => {
        // 每个接口的数据
        d.list.forEach((item) => {
          const nId = item.uuid;
          if (!markedId.has(nId)) {
            uuidList.add(nId);
          }
        });
        res.write(`event: fans\ndata: ${JSON.stringify(d)}\n\n`);
      });

      // 单个人爬取结束
      res.write(`event: partEnd\ndata: ${i + 1}\n\n`);

      if (depth == 0) {
        depthCount[1] = uuidList.size;
        depth += 1;
      } else if (depth == 1 && i == depthCount[1] - 1) {
        depthCount[2] = uuidList.size;
        depth += 1;
      } else if (depth == 2 && i == depthCount[2] - 1) {
        break;
      }
    }

    // 所有任务完成
    res.write(`event: end\ndata: 1\n\n`);
    res.end();
  } catch (err) {
    next(err);
  }
});

export default router;
