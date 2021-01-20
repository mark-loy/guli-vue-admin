<template>
  <div>
    <el-card>
      <el-form :model="banner" ref="bannerRef" label-width="120px">
        <el-form-item label="banner标题" style="width: 60%">
          <el-input v-model="banner.title" />
        </el-form-item>

        <el-form-item label="banner排序">
          <el-input-number
            v-model="banner.sort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="链接地址" style="width: 60%">
          <el-input v-model="banner.linkUrl" />
        </el-form-item>

        <el-form-item label="上传banner图" style="width: 60%">
          <el-upload
            class="avatar-uploader"
            :action="server_url + 'api/oss/fileupload'"
            :show-file-list="false"
            :limit="1"
            :on-success="handleSuccess"
          >
            <img v-if="banner.imageUrl " :src="banner.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="saveBtnDisabled"
            type="primary"
            @click="saveOrUpdate()"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import bannerApi from "@/api/cms/banner";

export default {
  data() {
    return {
      /* banner表单对象 */
      banner: {},
      /* 控制表单提交按钮 */
      saveBtnDisabled: false,
      /* 获取图片上传接口地址 */
      server_url: process.env.BASE_API,
    };
  },
  created() {
    this.init();
  },
  watch: {
    /* 监听路由变化 */
    $route(to, from) {
      this.init();
    },
  },
  methods: {
    /* 初始化方法 */
    init() {
      // 判断路由
      if (this.$route.params && this.$route.params.id) {
        // 修改路由
        this.getBannerId(this.$route.params.id);
      } else {
        // 保存路由，对表单数据进行清空
        this.banner = {
          imageUrl: ''
        };
      }
    },
    /* 保存或修改banner */
    saveOrUpdate() {
      // 判断banner中是否存在id值
      if (this.banner.id) {
        // 修改路由
        this.updateBanner();
      } else {
        this.saveBanner();
      }
    },
    /* 上传图片成功回调 */
    handleSuccess(res, file) {
      this.banner.imageUrl = res.data.url;
    },
    /* 保存banner */
    saveBanner() {
      // 验证banner表单数据
      if (
        this.banner.title === undefined ||
        this.banner.sort === undefined ||
        this.banner.linkUrl === undefined ||
        this.banner.imageUrl === undefined
      ) {
        return this.$message.error("请将表单填写完整");
      }
      // 禁用提交按钮，防止表单重复提交
      this.saveBtnDisabled = true;
      // 调用api
      bannerApi.saveBanner(this.banner).then((res) => {
        // 提示
        this.$message.success("保存banner成功");
        // 路由跳转到列表页
        this.$router.push("/cms/banner/list");
      });
    },
    /* 修改banner */
    updateBanner() {
      // 禁用提交按钮，防止表单重复提交
      this.saveBtnDisabled = true;
      // 调用api
      bannerApi.updateBanner(this.banner).then((res) => {
        // 提示
        this.$message.success("修改banner成功");
        // 路由跳转到列表页
        this.$router.push("/cms/banner/list");
      });
    },
    /* 根据id查询banner */
    getBannerId(id) {
      // 调用api
      bannerApi.selectBannerId(id).then((res) => {
        this.banner = res.data.banner;
      });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 478px;
  height: 278px;
  line-height: 278px;
  text-align: center;
}
.avatar {
  width: 478px;
  height: 278px;
  display: block;
}
</style>