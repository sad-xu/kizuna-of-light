let i = 0;

const generateMockUserList = (n = 10) => {
  return Array.from({ length: n }).map((_) => {
    const j = i++; //Math.round(Math.random() * 100);
    return {
      name: `${j}`,
      symbol:
        'image://https://ff14risingstones.gcloud.com.cn/avatar/20240606/10021689/55d59d5e0a0d4d1d83b3389566199a14/1717647172015_159f33351717647172015.png',
      //
      uuid: `${j}`,
      character_name: `n_${j}`,
      avatar:
        'https://ff14risingstones.gcloud.com.cn/default/20240314/10094041/c5d830bb304142579562465219f55a9c/1710387368557_505fc4651710387368557.jpg',
      test_limited_badge: 0, // 测试贡献徽章 3-金
      collapse_badge: 1, // 崩之家 徽章
      posts2_creator_badge: 0, // 攻略创作者徽章 1-铜
      admin_tag: 0, // 官方账号 管理员徽章  1-银  2-金
      area_name: '猫小胖',
      group_name: '紫水栈桥',
      profile: 'xxx', // 签名
      status: 1,
      relation: 1,
    };
  });
};

const generateMockRelation = (userList: any[]) => {
  const relationList: any[] = [];
  // 关注关系
  userList.forEach((user, i) => {
    userList.forEach((u, j) => {
      if ((user.name === '0' || Math.random() > 0.8) && i != j) {
        relationList.push({
          source: user.name,
          target: u.name,
          lineStyle: { color: '#f00' },
        });
      }
    });
  });
  // 粉丝关系
  userList.forEach((user, i) => {
    userList.forEach((u, j) => {
      if ((u.name === '0' || Math.random() > 0.8) && i != j) {
        relationList.push({
          source: user.name,
          target: u.name,
          lineStyle: { color: '#0f0' },
        });
      }
    });
  });
  return relationList;
};

/** 模拟用户列表 */
export const mockAllUser = generateMockUserList(5);

/** 所有相关人的关注和粉丝关系 */
export const mockRelationData = generateMockRelation(mockAllUser);

/** 生成新增关系 */
export function generateRelationData(nodes: any, num: number) {
  const relationList: any[] = [];
  const sourceUser = generateMockUserList(num);
  const targetUser = [...nodes, ...generateMockUserList(num)];
  const type = Math.random() > 0.5 ? 1 : 2;
  sourceUser.forEach((user, i) => {
    targetUser.forEach((u, j) => {
      // if (Math.random() > 0.8 && i != j) {
      relationList.push({
        source: user,
        target: u,
        lineStyle: { color: type === 1 ? '#f00' : '#0f0' },
      });
      // }
    });
  });
  return relationList;
}
