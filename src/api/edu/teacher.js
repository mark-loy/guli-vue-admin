import request from '@/utils/request'

const app_name = "api/edu/teacher"

export default {
  /* 多条件组合分页查询讲师 */
  getTeacherList(current, size, pageTeacherQuery) {
    return request({
      url: `${app_name}/page/${current}/${size}`,
      method: 'post',
      data: pageTeacherQuery
    })
  },
  /* 添加讲师 */
  saveTeacher(teacher) {
    return request({
      url: `${app_name}/add`,
      method: 'post',
      data: teacher
    })
  },
  /* 根据id查询讲师信息 */
  getTeacherInfo(id) {
    return request({
      method: 'get',
      url: `${app_name}/${id}`
    })
  },
  /* 修改讲师信息 */
  updateTeacher(teacher) {
    return request({
      method: 'put',
      url: `${app_name}/update`,
      data: teacher
    })
  },
  /* 删除讲师 */
  removeTeacher(id) {
    return request({
      method: 'delete',
      url: `${app_name}/delete/${id}`
    })
  },
  /* 查询所有讲师 */
  getAllTeacher() {
    return request({
      method: 'get',
      url: `${app_name}/all`
    })
  }

}