import request from '@/utils/request'

export default {
  /* 保存课程小节 */
  saveVideo(video) {
    return request({
      method: 'post',
      url: '/edu/video/save',
      data: video
    })
  },
  /* 根据id查询小节 */
  getVideoById(id) {
    return request({
      method: 'get',
      url: `/edu/video/${id}`
    })
  },
  /* 修改章节 */
  updateVideo(video) {
    return request({
      method: 'put',
      url: '/edu/video/update',
      data: video
    })
  },
  /* 根据id删除小节 */
  deleteVideo(id) {
    return request({
      method: 'delete',
      url: `/edu/video/${id}`
    })
  }

}