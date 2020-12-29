<template>
  <div>
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="3"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover" />
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray">
          <span>共{{ coursePublish.lessonNum }}课时</span>
        </p>
        <p>
          <span
            >所属分类：{{ coursePublish.subjectLevelOne }} —
            {{ coursePublish.subjectLevelTwo }}</span
          >
        </p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish"
        >发布课程</el-button
      >
    </div>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";

export default {
  data() {
    return {
      /* 是否禁用 */
      saveBtnDisabled: false,
      /* 课程id */
      courseId: "",
      /* 课程发布信息 */
      coursePublish: {},
    };
  },
  created() {
    // 设置课程id
    this.courseId = this.$route.params.id;
    // 调用课程信息预览方法
    this.getCoursePublish();
  },
  methods: {
    /* 上一步方法 */
    previous() {
      // 路由跳转
      this.$router.push({ path: "/course/chapter/" + this.courseId });
    },
    /* 课程发布方法 */
    publish() {
      this.$confirm("此操作将发布该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用发布课程api
          courseApi.updateCourseStatus(this.courseId).then((res) => {
            // 提示
            this.$message.success("课程发布成功");
            // 路由跳转到列表页
            this.$router.push({ path: "/course/list" });
          });
        })
        .catch(() => {
          console.log("取消发布");
        });
    },
    /* 获取课程的发布信息 */
    getCoursePublish() {
      // 调用课程发布信息api
      courseApi.getCoursePublish(this.courseId).then((res) => {
        this.coursePublish = res.data.coursePublish;
      });
    },
  },
};
</script>

<style scoped>
.ccInfo {
  background: #f5f5f5;
  padding: 20px;
  overflow: hidden;
  border: 1px dashed #ddd;
  margin-bottom: 40px;
  position: relative;
}

.ccInfo img {
  background: #d6d6d6;
  width: 500px;
  height: 278px;
  display: block;
  float: left;
  border: none;
}

.ccInfo .main {
  margin-left: 520px;
}

.ccInfo .main h2 {
  font-size: 28px;
  margin-bottom: 30px;
  line-height: 1;
  font-weight: normal;
}
.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main p {
  margin-bottom: 10px;
  word-wrap: break-word;
  line-height: 24px;
  max-height: 48px;
  overflow: hidden;
}

.ccInfo .main h3 {
  left: 540px;
  bottom: 20px;
  line-height: 1;
  font-size: 28px;
  color: #d32f24;
  font-weight: normal;
  position: absolute;
}
</style>