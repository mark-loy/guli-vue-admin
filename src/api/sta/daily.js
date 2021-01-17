import request from '@/utils/request'

export default {
  /* 生成统计数据 */
  generateStaData(date) {
    return request({
      method: 'get',
      url: `api/sta/daily/generate/${date}`
    })
  },
  /* 获取统计数据 */
  getStaData(dailyQuery) {
    return request({
      method: 'post',
      url: `api/sta/daily/get`,
      data: dailyQuery
    })
  }
}