import request from '@/utils/request'

const api_name = "api/edu/chapter"

export default {
  /* 获取课程章节树状信息 */
  getChapters(courseId) {
    return request({
      method: 'get',
      url: `${api_name}/list/${courseId}`
    })
  },
  /* 保存课程章节 */
  saveChapter(chapter) {
    return request({
      method: 'post',
      url: `${api_name}/save`,
      data: chapter
    })
  },
  /* 根据id查询章节 */
  getChapterById(id) {
    return request({
      method: 'get',
      url: `${api_name}/${id}`
    })
  },
  /* 修改章节 */
  updateChapter(chapter) {
    return request({
      method: 'put',
      url: `${api_name}/update`,
      data: chapter
    })
  },
  /* 删除章节 */
  deleteChapter(id) {
    return request({
      method: 'delete',
      url: `${api_name}/${id}`
    })
  }


}