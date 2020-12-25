<template>
  <div>
    <el-card>
      <el-form label-width="120px">
        <!-- 下载excel模板 -->
        <el-form-item label="信息描述">
          <el-tag type="info">excel模版说明</el-tag>
          <el-tag>
            <i class="el-icon-download"/>
            <a :href="OSS_PATH + '/excel/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xls'">点击下载模版</a>
          </el-tag>
        </el-form-item>

        <!-- 上传excel -->
        <el-form-item label="选择Excel">
          <el-upload
            ref="upload"
            :auto-upload="false"
            :on-success="fileUploadSuccess"
            :on-error="fileUploadError"
            :disabled="importBtnDisabled"
            :limit="1"
            :action="BASE_API + '/edu/subject/classify/save'"
            name="file"
            accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"> <!-- 限制上传文件的类型为excel -->
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              :loading="loading"
              style="margin-left: 10px;"
              size="small"
              type="success"
              @click="submitUpload">{{ fileUploadBtnText }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* OSS前缀路径 */
      OSS_PATH: '',
      /* 获取api通用地址 */
      BASE_API: process.env.BASE_API,
      /* 是否禁用上传组件 */
      importBtnDisabled: false,
      /* 按钮的加载状态 */
      loading: false,
      /* 上传按钮文字 */
      fileUploadBtnText: '上传到服务器',
    }
  },
  methods: {
    /* excel上传方法 */
    submitUpload() {
      // 设置上传按钮文字
      this.fileUploadBtnText = "正在上传"
      // 设置上传按钮为加载状态
      this.loading = true
      // 启用上传组件
      this.importBtnDisabled = true
      // 手动调用上传方法
      this.$refs.upload.submit()
    },
    /* excel上传成功后方法 */
    fileUploadSuccess(res) {
      // 设置上传按钮文字
      this.fileUploadBtnText = "上传成功"
      // 设置上传按钮为普通状态
      this.loading = false
    },
    /* excel上传失败后方法 */
    fileUploadError(error) {
      // 设置上传按钮文字
      this.fileUploadBtnText = "上传失败"
      // 设置上传按钮为普通状态
      this.loading = false
    },
  }
}
</script>

<style>

</style>