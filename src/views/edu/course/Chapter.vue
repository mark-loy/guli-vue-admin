<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-button type="text" @click="saveChapterVisible">添加章节</el-button>

    <ul class="chanpterList">
      <li v-for="chapter in chapters" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="saveVideoVisible(chapter.id)"
              >添加课时</el-button
            >
            <el-button type="text" @click="updateChapterVisible(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="deleteChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>

        <ul class="videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideoVisible(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="deleteVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-button @click="previous">上一步</el-button>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
      >下一步</el-button
    >

    <!-- 添加和修改章节对话框 -->
    <el-dialog :visible.sync="chapterVisible" :title="chapterText + '章节'">
      <el-form
        :model="chapter"
        :rules="chapterRule"
        ref="chapterRef"
        label-width="120px"
      >
        <el-form-item label="章节标题" prop="title">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序" prop="sort">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetChapterForm">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="videoVisible" :title="videoText + '课时'">
      <el-form
        :model="video"
        :rules="videoRule"
        ref="videoRef"
        label-width="120px"
      >
        <el-form-item label="课时标题" prop="title">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序" prop="sort">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费" prop="isFree">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetVideorForm">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapterApi from "@/api/edu/chapter";
import videoApi from "@/api/edu/video";

export default {
  data() {
    return {
      /* 是否禁用 */
      saveBtnDisabled: false,
      /* 课程id */
      courseId: "",
      /* 章节数据源 */
      chapters: [],
      /* 控制章节对话框 */
      chapterVisible: false,
      /* 章节表单 */
      chapter: {
        title: ''
      },
      /* 章节表单验证规则 */
      chapterRule: {
        title: [{ required: true, message: "请输入章节名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入章节排序", trigger: "blur" }],
      },
      /* 章节id */
      chapterId: "",
      /* 章节对话框文本 */
      chapterText: "添加",
      /* 小节对话框文本 */
      videoText: "添加",
      /* 控制小节对话框 */
      videoVisible: false,
      /* 小节表单 */
      video: {},
      /* 控制小节表单提交按钮 */
      saveVideoBtnDisabled: false,
      /* 小节表单验证规则 */
      videoRule: {
        title: [{ required: true, message: "请输入课时名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入课时排序", trigger: "blur" }],
        isFree: [
          { required: true, message: "请选择课时状态", trigger: "change" },
        ],
      },
    };
  },
  created() {
    // 判断并获取课程id
    if (this.$route.params.id !== undefined) {
      this.courseId = this.$route.params.id;
    }

    this.getChaptersData();
  },
  methods: {
    /* 上一步方法 */
    previous() {
      // 路由跳转
      this.$router.push("/course/info/" + this.courseId);
    },
    /* 下一步方法 */
    next() {
      // 判断课程列表数据源是否为空
      if (this.chapters.length === 0) {
        return this.$message.error("请先添加课程大纲")
      }
      // 路由跳转
      this.$router.push("/course/publish/" + this.courseId);
    },
    /* 获取章节信息 */
    getChaptersData() {
      // 调用获取章节信息api
      chapterApi.getChapters(this.courseId).then((res) => {
        this.chapters = res.data.chapters;
      });
    },
    /* 章节表单提交 */
    saveOrUpdate() {
      // 判断是保存还是修改章节
      if (this.chapter.courseId === "") {
        // 调用保存章节方法
        this.saveChapter();
      } else {
        // 调用修改章节方法
        this.editChapter();
      }
    },
    /* 添加章节按钮方法 */
    saveChapterVisible() {
      // 清空表单
      this.chapter.title = "";
      this.chapter.sort = 0;
      this.chapter.courseId = "";
      // 显示对话框
      this.chapterVisible = true;
    },
    /* 保存章节 */
    saveChapter() {
      // 验证章节表单
      this.$refs.chapterRef.validate((valid) => {
        if (valid) {
          // 设置课程id
          this.chapter.courseId = this.courseId;
          // 调用保存章节api
          chapterApi.saveChapter(this.chapter).then((res) => {
            this.$message.success("添加章节成功");
            // 刷新数据
            this.getChaptersData();
            // 重置表单
            this.resetChapterForm()
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 重置章节表单 */
    resetChapterForm() {
      // 清空表单
      this.chapter = {}
      // 关闭章节对话框
      this.chapterVisible = false;
      // 重置表单
      this.$refs.chapterRef.resetFields();
    },
    /* 编辑章节按钮方法 */
    updateChapterVisible(id) {
      // 修改章节路由
      this.chapterText = "修改";
      // 章节信息回显
      chapterApi.getChapterById(id).then((res) => {
        this.chapter = res.data.chapter;
      });
      // 显示对话框
      this.chapterVisible = true;
    },
    /* 编辑章节 */
    editChapter() {
      // 验证章节表单
      this.$refs.chapterRef.validate((valid) => {
        if (valid) {
          // 调用保存章节api
          chapterApi.updateChapter(this.chapter).then((res) => {
            this.$message.success("修改章节成功");
            // 刷新数据
            this.getChaptersData();
            // 关闭对话框
            this.chapterVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 删除章节 */
    deleteChapter(id) {
      this.$confirm("此操作将永久删除该章节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用删除章节api
          chapterApi.deleteChapter(id).then((res) => {
            // 提示
            this.$message.success("删除章节成功");
            // 刷新页面数据
            this.getChaptersData();
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    /* 小节保存或修改 */
    saveOrUpdateVideo() {
      // 判断是执行保存还是修改
      if (this.video.id === undefined) {
        // 保存
        this.saveVideo();
      } else {
        this.updateVideo();
      }
    },
    /* 添加小节按钮 */
    saveVideoVisible(id) {
      // 设置章节id
      this.chapterId = id;
      // 显示对话框
      this.videoVisible = true;
    },
    /* 添加小节 */
    saveVideo() {
      // 校验小节表单
      this.$refs.videoRef.validate((valid) => {
        if (valid) {
          // 设置课程id
          this.video.courseId = this.courseId;
          // 设置章节id
          this.video.chapterId = this.chapterId;
          // 调用保存小节api
          videoApi.saveVideo(this.video).then((res) => {
            // 提示
            this.$message.success("添加课时成功");
            // 刷新数据
            this.getChaptersData();
            // 重置表单
            this.resetVideorForm()
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 编辑小节按钮 */
    editVideoVisible(id) {
      // 调用查询小节api，用于数据回显
      videoApi.getVideoById(id).then((res) => {
        this.video = res.data.video;
      });
      // 设置对话框文本
      this.videoText = "修改";
      // 显示对话框
      this.videoVisible = true;
    },
    /* 修改小节 */
    updateVideo() {
      // 校验小节表单
      this.$refs.videoRef.validate((valid) => {
        if (valid) {
          videoApi.updateVideo(this.video).then((res) => {
            // 提示成功
            this.$message.success("修改小节成功");
            // 刷新数据
            this.getChaptersData();
            // 关闭对话框
            this.videoVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /* 删除小节 */
    deleteVideo(id) {
      this.$confirm("此操作将永久删除该小节, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用删除章节api
          videoApi.deleteVideo(id).then((res) => {
            // 提示
            this.$message.success("删除小节成功");
            // 刷新页面数据
            this.getChaptersData();
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    /* 小节对话框，取消按钮 */
    resetVideorForm() {
      // 关闭对话框
      this.videoVisible = false
      // 重置小节表单
      this.$refs.videoRef.resetFields()
    }
  },
};
</script>

<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
  list-style: none;
}

.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}

.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>