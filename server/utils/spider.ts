import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { Response } from 'express';

/**
 * 爬虫
 *
 */

/** 分页参数 */
interface PageParams {
  uuid: string;
  page: number;
  limit: number;
}

/** 用户信息 */
export interface UserInfo {
  admin_tag: number;
  area_name: string;
  avatar?: string;
  character_name: string;
  collapse_badge: number;
  group_name: string;
  posts2_creator_badge: number;
  profile?: string;
  relation: number;
  status: number;
  test_limited_badge: number;
  uuid: string;
}

/** 用户列表 */
interface UserListRes {
  count: number;
  rows: UserInfo[];
}

/** 设置cookie */
export const setCookie = (cookie: string) => {
  axios.defaults.headers.common['Cookie'] = cookie;
};

/** 随机延时 */
export const randomDelay = (minSecond = 1, maxSecond = 3) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, (minSecond + Math.random() * (maxSecond - minSecond)) * 1000);
  });
};

/** 模拟列表 */
export const mockList = async (total = 100): Promise<UserListRes> => {
  await randomDelay(0.3, 1);
  return {
    count: total,
    rows: Array.from({ length: Math.min(Math.ceil(Math.random() * total), 10) }).map(() => {
      const n = Math.round(Math.random() * 50);
      return {
        uuid: `10094${n}`,
        character_name: `n${n}`,
        avatar:
          'https://ff14risingstones.gcloud.com.cn/default/20240314/10094041/c5d830bb304142579562465219f55a9c/1710387368557_505fc4651710387368557.jpg',
        test_limited_badge: 0,
        collapse_badge: 1,
        posts2_creator_badge: 0,
        admin_tag: 0,
        area_name: '猫小胖',
        group_name: '紫水栈桥',
        profile: 'xxx',
        status: 1,
        relation: 1,
      };
    }),
  };
};

/** 获取关注的人列表 */
const getFollowList = (params: PageParams) => {
  return axios.get<void, UserListRes>(
    `https://apiff14risingstones.web.sdo.com/api/home/userRelation/followList?uuid=${params.uuid}&page=${params.page}&limit=${params.limit}`
  );
};

/** 获取粉丝列表 */
const getFansList = (params: PageParams) => {
  return axios.get<void, UserListRes>(
    `https://apiff14risingstones.web.sdo.com/api/home/userRelation/fansList?uuid=${params.uuid}&page=${params.page}&limit=${params.limit}`
  );
};

/** 获取指定人的所有关注的人 */
export const getAllFollowsById = async (uuid: string, cb: (d) => void) => {
  try {
    const limit = 50;
    let totalPage = 1;
    const list: UserInfo[] = [];
    for (let i = 1; i <= totalPage; i++) {
      const { count, rows } = await mockList(6);
      // const { count, rows } = await getFollowList({
      //   uuid,
      //   page: i,
      //   limit: limit,
      // });
      list.push(...rows);
      totalPage = Math.ceil(count / limit);
      cb({ uuid, list: rows });
      await randomDelay();
    }
    return list;
  } catch (err) {
    console.log(err);
  }
};

/** 获取指定人的所有粉丝 */
export const getAllFansById = async (uuid: string, cb: (d) => void) => {
  try {
    const limit = 50;
    let totalPage = 1;
    const list: UserInfo[] = [];
    for (let i = 1; i <= totalPage; i++) {
      const { count, rows } = await mockList(6);
      // const { count, rows } = await getFansList({
      //   uuid,
      //   page: i,
      //   limit: limit,
      // });
      list.push(...rows);
      totalPage = Math.ceil(count / limit);
      cb({ uuid, list: rows });
      await randomDelay();
    }
    return list;
  } catch (err) {
    console.log(err);
  }
};

/** 是否正在爬取 同一时刻只能有一个任务 */
let isSpidering = false;

/** 回调列表 */
const resList = new Set<Response>();

/** 判断是否正在爬取 */
export const checkIsSpidering = () => {
  return isSpidering;
};

/** 添加回调 */
export const addResCallback = (res) => {
  resList.add(res);
};

/** 移除回调 */
// const removeResCallback = (res) => {
//   resList.delete(res);
// };

/** 触发回调 */
const triggerResCallback = (str: string) => {
  resList.forEach((res) => {
    res.write(str);
  });
};

/** 开始爬取任务 */
export const startSpider = async (reqId: string) => {
  try {
    if (isSpidering) {
      return;
    }
    isSpidering = true;
    // 当前爬取深度 0我-1关注&粉丝-2关注&粉丝
    let depth = 0;
    const depthCount = [1, 1, 1];
    // 待爬取用户
    const uuidList = new Set();
    // 已记录用户
    const markedId = new Set();
    // 所有数据
    const allData: { id: string; follows: UserInfo[]; fans: UserInfo[] } = {
      id: reqId,
      follows: [],
      fans: [],
    };

    uuidList.add(reqId);

    // 获取目标用户的关注和粉丝
    for (let i = 0; i < uuidList.size; i++) {
      const id = uuidList[i];
      markedId.add(id);
      // 单个人爬取开始
      triggerResCallback(`event: partStart\ndata: ${i + 1}\n\n`);
      // 关注
      const followsList = await getAllFollowsById(id, (d) => {
        // 每次请求的数据
        d.list.forEach((item) => {
          const nId = item.uuid;
          if (!markedId.has(nId)) {
            uuidList.add(nId);
          }
        });
        triggerResCallback(`event: follows\ndata: ${JSON.stringify(d)}\n\n`);
      });
      allData.follows.push(...(followsList ?? []));
      // 粉丝
      const fansList = await getAllFansById(id, (d) => {
        // 每次请求的数据
        d.list.forEach((item) => {
          const nId = item.uuid;
          if (!markedId.has(nId)) {
            uuidList.add(nId);
          }
        });
        triggerResCallback(`event: fans\ndata: ${JSON.stringify(d)}\n\n`);
      });
      allData.fans.push(...(fansList ?? []));

      // 单个人爬取结束
      triggerResCallback(`event: partEnd\ndata: ${i + 1}\n\n`);
      await randomDelay();

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
    triggerResCallback(`event: end\ndata: 1\n\n`);

    // 保存到本地
    const filePath = path.join(__dirname, 'ffxiv_relation', `${reqId}.json`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFile(filePath, JSON.stringify(allData), 'utf8', (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('文件写入成功！');
      }
    });

    isSpidering = false;

    resList.forEach((res) => {
      res.end();
    });
    resList.clear();
  } catch (err) {
    isSpidering = false;
  }
};
