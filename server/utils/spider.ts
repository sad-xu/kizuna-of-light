import axios from 'axios';

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
interface UserInfo {
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
    rows: Array.from({ length: 10 }).map(() => {
      const n = Math.round(Math.random() * 100);
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
      // const { count, rows } = await mockList(100);
      const { count, rows } = await getFollowList({
        uuid,
        page: i,
        limit: limit,
      });
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
      const { count, rows } = await getFansList({
        uuid,
        page: i,
        limit: limit,
      });
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
