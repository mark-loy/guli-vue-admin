import request from '@/utils/request'

const API_BASE = 'api/order'

export default {
  /* 查询订单分页数据 */
  selectOrderPage(current, limit, orderQuery) {
    return request({
      method: 'post',
      url: `${API_BASE}/page/${current}/${limit}`,
      data: orderQuery
    })
  },
  /* 删除订单 */
  deleteOrder(oid) {
    return request({
      method: 'delete',
      url: `${API_BASE}/${oid}`
    })
  }
}