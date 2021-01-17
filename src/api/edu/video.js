import request from '@/utils/request'

const app_name = "api/edu/video"

export default {
  /* 保存课程小节 */
  saveVideo(video) {
    return request({
      method: 'post',
      url: `${app_name}/save`,
      data: video
    })
  },
  /* 根据id查询小节 */
  getVideoById(id) {
    return request({
      method: 'get',
      url: `${app_name}/${id}`
    })
  },
  /* 修改章节 */
  updateVideo(video) {
    return request({
      method: 'put',
      url: `${app_name}/update`,
      data: video
    })
  },
  /* 根据id删除小节 */
  deleteVideo(id) {
    return request({
      method: 'delete',
      url: `${app_name}/${id}`
    })
  },
  /* 根据id删除上传视频 */
  deleteVod(id) {
    return request({
      method: 'delete',
      url: `api/vod/${id}`
    })
  }

}