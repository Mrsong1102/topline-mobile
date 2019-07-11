/**
 * 封装用户相关接口请求函数
 */
import request from '@/utils/request'

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
