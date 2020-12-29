<template>
  <div>
    <el-card>
      <el-form label-width="120px">
        <el-form-item label="讲师名称" style="width: 60%">
          <el-input v-model="teacher.name" />
        </el-form-item>
        <el-form-item label="讲师排序">
          <el-input-number
            v-model="teacher.sort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="讲师头衔">
          <el-select v-model="teacher.level" clearable placeholder="请选择">
            <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
            <el-option :value="1" label="高级讲师" />
            <el-option :value="2" label="首席讲师" />
          </el-select>
        </el-form-item>
        <el-form-item label="讲师资历" style="width: 60%">
          <el-input v-model="teacher.career" />
        </el-form-item>
        <el-form-item label="讲师简介" style="width: 60%">
          <el-input v-model="teacher.intro" :rows="10" type="textarea" />
        </el-form-item>

        <!-- 讲师头像 -->
        <el-form-item label="讲师头像">
          <!-- 头衔缩略图 -->
          <pan-thumb :image="teacher.avatar" />
          <!-- 文件上传按钮 -->
          <el-button
            type="primary"
            icon="el-icon-upload"
            @click="imagecropperShow = true"
            >更换头像
          </el-button>
          <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调 -->
          <image-cropper
            v-show="imagecropperShow"
            :width="300"
            :height="300"
            :key="imagecropperKey"
            :url=" server_url + '/oss/fileupload'"
            field="file"
            @close="imagecropperShow = false"
            @crop-upload-success="cropSuccess"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="saveBtnDisabled"
            type="primary"
            @click="saveOrUpdate"
            >保存</el-button
          >
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";

import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: {
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      /* 讲师对象 */
      teacher: {
        avatar: ''
      },
      /* 是否禁用保存按钮 */
      saveBtnDisabled: false,
      /* 图片上传的唯一key */
      imagecropperKey: 0,
      /* 是否显示上传图片弹框 */
      imagecropperShow: false,
      /* 获取图片上传接口地址 */
      server_url: process.env.BASE_API
    };
  },
  created() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  methods: {
    init() {
      const id = this.$route.params.id;
      /* 判断路由是否为修改讲师 */
      if (id !== undefined) {
        this.teacher.id = id;
        this.getTeacherById(id);
      } else {
        // 清空讲师表单对象
        this.teacher = {};
      }
    },
    /* 添加或更新 */
    saveOrUpdate() {
      /* 判断讲师id是否为0 */
      if (this.teacher.id !== undefined) {
        // 执行修改讲师
        this.updateTeacher();
      } else {
        // 执行添加讲师
        this.saveTeacher();
      }
    },
    /* 添加讲师 */
    saveTeacher() {
      /* 调用添加讲师api */
      teacherApi.saveTeacher(this.teacher).then((res) => {
        this.$message.success("添加讲师成功");
        // 禁用保存按钮
        this.saveBtnDisabled = true;
        // 路由跳转
        this.$router.push("/teacher/list");
      });
    },
    /* 根据id查询讲师信息 */
    getTeacherById(id) {
      teacherApi.getTeacherInfo(id).then((res) => {
        this.teacher = res.data.teacher;
      });
    },
    /* 修改讲师 */
    updateTeacher() {
      teacherApi.updateTeacher(this.teacher).then((res) => {
        this.$message.success("编辑讲师成功");
        // 禁用保存按钮
        this.saveBtnDisabled = true;
        // 路由跳转
        this.$router.push("/teacher/list");
      });
    },
    /* 头像上传成功 */
    cropSuccess(data) {
      this.teacher.avatar = data.url
    }
  },
};
</script>

<style>
</style>