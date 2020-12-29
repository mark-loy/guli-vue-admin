import request from '@/utils/request'

export default {
  /* 多条件组合分页查询讲师 */
  getTeacherList(current, size, pageTeacherQuery) {
    return request({
      url: `/edu/teacher/page/${current}/${size}`,
      method: 'post',
      data: pageTeacherQuery
    })
  },
  /* 添加讲师 */
  saveTeacher(teacher) {
    return request({
      url: '/edu/teacher/add',
      method: 'post',
      data: teacher
    })
  },
  /* 根据id查询讲师信息 */
  getTeacherInfo(id) {
    return request({
      method: 'get',
      url: `/edu/teacher/${id}`
    })
  },
  /* 修改讲师信息 */
  updateTeacher(teacher) {
    return request({
      method: 'put',
      url: '/edu/teacher/update',
      data: teacher
    })
  },
  /* 删除讲师 */
  removeTeacher(id) {
    return request({
      method: 'delete',
      url: `/edu/teacher/delete/${id}`
    })
  },
  /* 查询所有讲师 */
  getAllTeacher() {
    return request({
      method: 'get',
      url: '/edu/teacher/all'
    })
  }

}