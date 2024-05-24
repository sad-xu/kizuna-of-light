import request from '@/utils/request';

const urlBase = '/api/base';

export function getTestData() {
  return request({
    url: urlBase + '/test1',
    method: 'get'
  });
}

// 用户反馈
// export function uploadFeedback(content: string, name?: string) {
//   return request({
//     url: urlBase + '/feedback',
//     method: 'post',
//     data: {
//       content,
//       name,
//     },
//   });
// }
