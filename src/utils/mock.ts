const generateMockUserList = (n = 10) => {
  return Array.from({ length: n }).map((_) => {
    const j = Math.round(Math.random() * 20);
    return {
      uuid: `1000${j}`,
      character_name: `n_${j}`,
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
  });
};

const generateMockRelation = (userList: any[]) => {
  const relationList: any[] = [];
  // 关注关系
  userList.forEach((user, i) => {
    userList.forEach((u, j) => {
      if (Math.random() > 0.8 && i != j) {
        relationList.push({
          source: user,
          target: u,
          type: 1,
        });
      }
    });
  });
  // 粉丝关系
  userList.forEach((user, i) => {
    userList.forEach((u, j) => {
      if (Math.random() > 0.8 && i != j) {
        relationList.push({
          source: user,
          target: u,
          type: 2,
        });
      }
    });
  });
  return relationList;
};

/** 模拟用户列表 */
export const mockAllUser = generateMockUserList(10);

/** 所有相关人的关注和粉丝关系 */
export const mockRelationData = generateMockRelation(mockAllUser);

/** 生成新增关系 */
export function generateRelationData(num: number) {
  const relationList: any[] = [];
  const sourceUser = generateMockUserList(num);
  const targetUser = generateMockUserList(num);
  const type = Math.random() > 0.5 ? 1 : 2;
  sourceUser.forEach((user, i) => {
    targetUser.forEach((u, j) => {
      if (Math.random() > 0.8 && i != j) {
        relationList.push({
          source: user,
          target: u,
          type: type,
        });
      }
    });
  });
  return relationList;
}
