import request from '@/utils/request'

export default {
  /* 查询课程分类tree */
  getSubjectClassify() {
    return request({
      method: 'get',
      url: 'api/edu/subject/list'
    })
  }

}