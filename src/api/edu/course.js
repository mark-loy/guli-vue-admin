import request from '@/utils/request'

export default {
  /* 保存课程信息 */
  saveCourseInfo(courseInfo) {
    return request({
      method: 'post',
      url: '/edu/course/save',
      data: courseInfo
    })
  },
  /* 根据id获取课程信息 */
  getCourseById(id) {
    return request({
      method: 'get',
      url: `/edu/course/${id}`
    })
  },
  /* 修改课程信息 */
  updateCourse(courseInfo) {
    return request({
      method: 'put',
      url: '/edu/course/update',
      data: courseInfo
    })
  },
  /* 查询课程发布信息 */
  getCoursePublish(id) {
    return request({
      method: 'get',
      url: `/edu/course/publish/${id}`
    })
  },
  /* 修改课程状态 */
  updateCourseStatus(id) {
    return request({
      method: 'put',
      url: `/edu/course/update/${id}`
    })
  },
  /* 分页查询 */
  getCoursePageQuery(current, size, courseQuery) {
    return request({
      method: 'post',
      url: `/edu/course/page/${current}/${size}`,
      data: courseQuery
    })
  },
  /* 删除课程 */
  deleteCourse(id) {
    return request({
      method: 'delete',
      url: `/edu/course/${id}`
    })
  }
}