export const enum ErrCode {
  OK, // 正常
  CUSTOM, // 自定义业务错误
  // 其他错误
  PARAMS_FAULT,
  NO_RESULT,
  DB_ERR,
}

const ERR_MSG = {
  [ErrCode.OK]: 'ok',
  [ErrCode.PARAMS_FAULT]: '参数错误',
  [ErrCode.NO_RESULT]: '无结果',
  [ErrCode.DB_ERR]: '数据库错误',
};

/** 构造返回值 */
export const ret = (res: any, data: any, code: ErrCode = ErrCode.OK, msg = '') => {
  return res.json({
    code,
    data,
    msg: msg || ERR_MSG[code],
  });
};

/** 参数校验 */
export const checkParams = (res: any, isFail: boolean) => {
  if (isFail) ret(res, null, ErrCode.PARAMS_FAULT);
  return isFail;
};

/** 正则转义 */
// export const ESCAPE_REG = /(\$|\$|\(|\)|\*|\+|\.|\[|\]|\?|\\|\^|\{|\}|\|)/g

/** 本地配置 */
export const config = {
  /** cookie */
  cookie: '',
  /** 每次请求的间隔 */
  interval: 1,
};

/** 修改配置 */
export const changeConfig = () => {};
