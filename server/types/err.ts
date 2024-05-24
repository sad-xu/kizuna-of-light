export default interface Err {
  _id: string
  // 错误来源
  source: string
  // 报错信息
  msg: string
  // 错误堆栈
  stack: string
  // 浏览器信息
  agent: string
  // 尺寸
  size: string
  // 用户id 可选
  userId: string
  // 错误发生时间
  t: number
}
