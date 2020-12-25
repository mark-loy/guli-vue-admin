<template>
  <div>
    <el-card>
      <el-input
        v-model="filterText"
        placeholder="搜索课程分类"
        style="margin-bottom: 30px"
      />
      <el-tree
        ref="subjectTree"
        :data="subjectClassify"
        :props="defaultProps"
        :filter-node-method="filterNode"
        default-expand-all
      />
    </el-card>
  </div>
</template>

<script>
import subjectApi from '@/api/subject'

export default {
  data() {
    return {
      /* 课程分类数据源 */
      subjectClassify: [],
      /* tree结构属性设置 */
      defaultProps: {
        label: 'title',
        children: 'children'
      },
      /* 过滤文本 */
      filterText: '',
    };
  },
  created() {
    this.getSubjectClassifyData()
  },
  methods: {
    /* 获取课程分类tree数据 */
    getSubjectClassifyData() {
      subjectApi.getSubjectClassify().then(res => {
        console.log(res);
        this.subjectClassify = res.data.subjectClassify
      })
    },
    /* tree结构过滤方法 */
    filterNode() {},

  },
};
</script>

<style>
</style>