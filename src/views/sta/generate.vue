
<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-button :disabled="btnDisabled" type="primary" @click="generateData()"
        >生成</el-button
      >
    </el-form>
  </div>
</template>

<script>
import staApi from '@/api/sta/daily'

export default {
  data() {
    return {
      /* 统计日期 */
      date: '',
      /* 控制生成按钮点击 */
      btnDisabled: false
    }
  },
  methods: {
    /* 生成统计数据 */
    generateData() {
      // 调用api
      staApi.generateStaData(this.date).then(res => {
        // 提示
        this.$message.success("生成统计数据成功")
        // 禁用生成按钮
        this.btnDisabled = true
        // 路由跳转到数据展示页面
        this.$router.push("/sta/show")
      })
    }
  }
};
</script>

<style>
</style>