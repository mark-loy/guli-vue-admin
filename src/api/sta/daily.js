import request from '@/utils/request'

export default {
  /* 生成统计数据 */
  generateStaData(date) {
    return request({
      method: 'get',
      url: `sta/daily/generate/${date}`
    })
  },
  /* 获取统计数据 */
  getStaData(dailyQuery) {
    return request({
      method: 'post',
      url: `sta/daily/get`,
      data: dailyQuery
    })
  }
}