
/** 背景动画 */
export const BG_VIDEO_LIST = [
  {
    name: '6.5',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb860/20240304vid.mp4',
  },
  {
    name: '6.4',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb860/20230915vid.mp4',
  },
  {
    name: '6.3',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb860/2023ftsvid.mp4',
  },
  {
    name: '6.2',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb860/20221219vid.mp4',
  },
  {
    name: '6.1',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb860/20220808vid.mp4',
  },
  {
    name: '6.0',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb860/20220210vid.mp4',
  },
  {
    name: '5.5',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb850/20210809vid.mp4',
  },
  {
    name: '5.4',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/ffweb850/20210401vid.mp4',
  },
  {
    name: '5.2',
    url: 'https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/5.2.mp4',
  },
  {
    name: '4.5',
    url: 'https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/4.5.mp4',
  },
  {
    name: '4.x',
    url: 'https://event-5gdjtgwpc8ae552d-1304999371.tcloudbaseapp.com/cdn/4.x.mp4',
  },
  {
    name: 'ladiesday',
    url: 'https://static.web.sdo.com/jijiamobile/pic/ff14/20220514ladiesday/ffladiesday.mp4',
  },
];

/** 时间显示 */
export function formatDate(t: number) {
  const now = new Date();
  const delta = Math.ceil((+now - t * 1000) / 1000);
  if (delta < 0) return '未来';
  else if (delta < 60) return '刚刚';
  else if (delta < 3600) return `${Math.ceil(delta / 60)}分钟前`; // 1 - 59分
  else if (delta < 86400) return `${Math.ceil(delta / 3600)}小时前`; // 1-23小时
  else if (delta < 2592000) return `${Math.ceil(delta / 86400)}天前`; // 1-30天
  else {
    // xxxx年x月x日 xx:xx
    const d = new Date(t * 1000);
    const year = d.getFullYear();
    const h = d.getHours();
    const m = d.getMinutes();
    return `${now.getFullYear() === year ? '' : year + '年'}${d.getMonth() + 1}月${d.getDate()}日 ${
      h > 9 ? h : '0' + h
    }:${m > 9 ? m : '0' + m}`;
  }
}

/** 是否是触摸设备 手机|平板 */
export const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  window.navigator.userAgent
);

/** 是否是iOS */
export const isIOS = window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

export default null;
