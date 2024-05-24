import axios from 'axios';

/**
 * 爬虫
 *
 */

/** 分页参数 */
interface PageParams {
  uuid: string;
  page: string;
  limit: string;
}

/** 设置cookie */
export const setCookie = (cookie: string) => {
  axios.defaults.headers.common['Cookie'] = cookie;
};

/** 获取关注的人列表 */
const getFollowList = (params: PageParams) => {
  return axios({
    method: 'get',
    url: `https://apiff14risingstones.web.sdo.com/api/home/userRelation/followList?uuid=${params.uuid}&page=${params.page}&limit=${params.limit}`,
  })
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
};

/** 获取粉丝列表 */
const getFansList = (params: PageParams) => {
  return axios({
    method: 'get',
    url: `https://apiff14risingstones.web.sdo.com/api/home/userRelation/fansList?uuid=${params.uuid}&page=${params.page}&limit=${params.limit}`,
  })
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

/** 获取指定人的所有关注的人 */

/** 获取指定人的所有粉丝 */
