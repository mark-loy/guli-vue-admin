import request from '@/utils/request'

const API_BASE = 'api/cms/banner'

export default {
  /* 查询banner分页数据 */
  selectBannerPage(current, limit) {
    return request({
      method: 'get',
      url: `${API_BASE}/${current}/${limit}`
    })
  },
  /* 保存banner */
  saveBanner(banner) {
    return request({
      method: 'post',
      url: `${API_BASE}/`,
      data: banner
    })
  },
  /* 修改banner */
  updateBanner(banner) {
    return request({
      method: 'put',
      url: `${API_BASE}/`,
      data: banner
    })
  },
  /* 根据id查询banner */
  selectBannerId(bid) {
    return request({
      method: 'get',
      url: `${API_BASE}/${bid}`,
    })
  },
  /* 删除banner */
  deleteBanner(bid) {
    return request({
      method: 'delete',
      url: `${API_BASE}/${bid}`,
    })
  }
}