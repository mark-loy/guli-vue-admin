<template>
  <div>
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form
      label-width="120px"
      ref="courseInfoRef"
      :model="courseInfo"
      :rules="courseInfoRules"
    >
      <el-form-item label="课程标题" style="width: 70%" prop="title">
        <el-input
          v-model="courseInfo.title"
          placeholder="示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 -->
      <el-form-item label="课程分类" prop="subjectId">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="changeOneSubject"
        >
          <el-option
            v-for="subject in subjects"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          ></el-option>
        </el-select>

        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in twoSubjects"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师" prop="teacherId">
        <el-select v-model="courseInfo.teacherId" placeholder="讲师">
          <el-option
            v-for="teacher in teachers"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时" prop="lessonNum">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <el-form-item label="课程价格" prop="price">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <!-- 课程简介 -->
      <el-form-item label="课程简介" style="width: 70%">
        <tinymce :height="500" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          class="cover-uploader"
          :action="BASE_API + '/oss/fileupload'"
          :show-file-list="false"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="cover" />
          <i v-else class="el-icon-plus cover-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";
import teacherApi from "@/api/edu/teacher";
import subjectApi from "@/api/edu/subject";

/* 富文本编辑器组件 */
import Tinymce from "@/components/Tinymce";

export default {
  components: {
    Tinymce,
  },
  data() {
    return {
      /* 是否禁用 */
      saveBtnDisabled: false,
      /* 课程信息表单对象 */
      courseInfo: {
        subjectParentId: "",
        subjectId: "",
        cover: "",
      },
      /* 表单验证 */
      courseInfoRules: {
        title: [{ required: true, message: "请填写课程标题", trigger: "blur" }],
        subjectId: [
          { required: true, message: "请选择课程二级分类", trigger: "change" },
        ],
        teacherId: [
          { required: true, message: "请选择课程讲师", trigger: "change" },
        ],
        lessonNum: [
          { required: true, message: "请填写总课时", trigger: "blur" },
        ],
        price: [{ required: true, message: "请填写课程价格", trigger: "blur" }],
      },
      /* 所有课程讲师 */
      teachers: [],
      /* 课程一级分类 */
      subjects: [],
      /* 课程二级分类 */
      twoSubjects: [],
      /* OSS上传地址 */
      BASE_API: process.env.BASE_API,
      /* 课程id */
      courseId: "",
    };
  },
  created() {
    this.getAllTeacher();
    this.getAllSubject();

    // 判断路由
    if (this.$route.params.id !== undefined) {
      this.courseId = this.$route.params.id;
      // 修改课程信息路由

      // 1. 课程信息回显
      courseApi.getCourseById(this.courseId).then((res) => {
        this.courseInfo = res.data.course;
        // 2. 课程分类二级回显
        // 遍历一级分类
        this.subjects.forEach((one) => {
          // 判断一级分类id是否等于选择的一级分类
          if (one.id === this.courseInfo.subjectParentId) {
            // 赋值
            this.twoSubjects = one.children;
          }
        });
      });
    }
  },
  methods: {
    /* 进入下一步 */
    next() {
      // 校验表单
      this.$refs.courseInfoRef.validate((valid) => {
        if (valid) {
          if (this.courseInfo.description === undefined) {
            this.$message.error("请填写课程简介");
            return false;
          }

          if (this.courseInfo.cover === undefined) {
            this.$message.error("请上传课程封面");
            return false;
          }
          // 禁用保存按钮，防止重复提交
          this.saveBtnDisabled = true;

          //判断路由
          if (this.courseId !== "") {
            // 修改路由
            courseApi.updateCourse(this.courseInfo).then(res => {
              // 路由跳转
              this.$router.push(`/course/chapter/${this.courseId}`);
            })
          } else {
            // 添加路由
            // 调用保存课程信息api
            courseApi.saveCourseInfo(this.courseInfo).then((res) => {
              // 路由跳转
              this.$router.push(`/course/chapter/${res.data.courseId}`);
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 查询所有讲师 */
    getAllTeacher() {
      // 调用查询所有讲师api
      teacherApi.getAllTeacher().then((res) => {
        this.teachers = res.data.teachers;
      });
    },
    /* 查询所有课程分类 */
    getAllSubject() {
      // 调用查询课程分类api
      subjectApi.getSubjectClassify().then((res) => {
        this.subjects = res.data.subjectClassify;
      });
    },
    /* 选择一级分类时调用 */
    changeOneSubject(val) {
      // 遍历一级分类
      this.subjects.forEach((one) => {
        // 判断一级分类id是否等于选择的一级分类
        if (one.id === val) {
          // 清空二级分类选择框
          this.courseInfo.subjectId = "";
          // 赋值
          this.twoSubjects = one.children;
        }
      });
    },
    /* 封面图片上传之前方法 */
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    /* 封面图片上传成功方法 */
    handleSuccess(res) {
      console.log(res);
      this.courseInfo.cover = res.data.url;
    },
  },
};
</script>

<style>
.cover {
  width: 378px;
  height: 378px;
  display: block;
}

.cover-uploader-icon {
  font-size: 38px;
  color: #8c939d;
  width: 378px;
  height: 378px;
  line-height: 378px;
  text-align: center;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.cover-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>