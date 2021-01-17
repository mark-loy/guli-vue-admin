import request from '@/utils/request'

const api_name = "api/edu/course"

export default {
  /* 保存课程信息 */
  saveCourseInfo(courseInfo) {
    return request({
      method: 'post',
      url: `${api_name}/save`,
      data: courseInfo
    })
  },
  /* 根据id获取课程信息 */
  getCourseById(id) {
    return request({
      method: 'get',
      url: `${api_name}/${id}`
    })
  },
  /* 修改课程信息 */
  updateCourse(courseInfo) {
    return request({
      method: 'put',
      url: `${api_name}/update`,
      data: courseInfo
    })
  },
  /* 查询课程发布信息 */
  getCoursePublish(id) {
    return request({
      method: 'get',
      url: `${api_name}/publish/${id}`
    })
  },
  /* 修改课程状态 */
  updateCourseStatus(id) {
    return request({
      method: 'put',
      url: `${api_name}/update/${id}`
    })
  },
  /* 分页查询 */
  getCoursePageQuery(current, size, courseQuery) {
    return request({
      method: 'post',
      url: `${api_name}/page/${current}/${size}`,
      data: courseQuery
    })
  },
  /* 删除课程 */
  deleteCourse(id) {
    return request({
      method: 'delete',
      url: `${api_name}/${id}`
    })
  }
}