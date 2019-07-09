import request from '@/utils/request'
/**
 * 封装用户相关接口请求函数
 */

export const login = ({
  mobile,
  code
}) => {
  // 执行其他逻辑
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
