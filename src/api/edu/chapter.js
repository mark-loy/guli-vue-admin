import request from '@/utils/request'

export default {
  /* 获取课程章节树状信息 */
  getChapters(courseId) {
    return request({
      method: 'get',
      url: `/edu/chapter/list/${courseId}`
    })
  },
  /* 保存课程章节 */
  saveChapter(chapter) {
    return request({
      method: 'post',
      url: '/edu/chapter/save',
      data: chapter
    })
  },
  /* 根据id查询章节 */
  getChapterById(id) {
    return request({
      method: 'get',
      url: `/edu/chapter/${id}`
    })
  },
  /* 修改章节 */
  updateChapter(chapter) {
    return request({
      method: 'put',
      url: '/edu/chapter/update',
      data: chapter
    })
  },
  /* 删除章节 */
  deleteChapter(id) {
    return request({
      method: 'delete',
      url: `/edu/chapter/${id}`
    })
  }


}