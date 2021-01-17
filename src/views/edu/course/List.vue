<template>
  <div>
    <el-card>
      <!--查询表单-->
      <el-form :inline="true" :model="courseQuery" ref="courseQueryRef">
        <!-- 所属分类：级联下拉列表 -->
        <!-- 标题 -->
        <el-form-item>
          <el-input v-model="courseQuery.title" placeholder="课程标题" />
        </el-form-item>
        <!-- 课程状态 -->
        <el-form-item>
          <el-select v-model="courseQuery.status" placeholder="请选择课程状态">
            <el-option label="未发布" value="Draft"></el-option>
            <el-option label="已发布" value="Normal"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getCourseList(current)"
          >查询</el-button
        >
        <el-button type="default" @click="courseQuery = {}">清空</el-button>
      </el-form>

      <!-- 表格 -->
      <el-table
        v-loading="courseLoading"
        :data="courses"
        element-loading-text="数据加载中"
        border
        fit
        highlight-current-row
        row-class-name="myClassList"
      >
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column label="课程信息" width="470" align="center">
          <template slot-scope="scope">
            <div class="info">
              <div class="pic">
                <img
                  :src="scope.row.cover"
                  alt="scope.row.title"
                  width="150px"
                />
              </div>
              <div class="title">
                <a href="">{{ scope.row.title }}</a>
                <p>{{ scope.row.lessonNum }}课时</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 'Normal' ? 'success' : 'danger'">
              {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate.substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.gmtModified.substr(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100" align="center">
          <template slot-scope="scope">
            {{
              Number(scope.row.price) === 0
                ? "免费"
                : "¥" + scope.row.price.toFixed(2)
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="buyCount"
          label="付费学员"
          width="100"
          align="center"
        >
          <template slot-scope="scope"> {{ scope.row.buyCount }}人 </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <router-link :to="'/edu/course/Info/' + scope.row.id">
              <el-button type="text" size="mini" icon="el-icon-edit"
                >编辑课程信息</el-button
              >
            </router-link>
            <router-link :to="'/edu/course/Chapter/' + scope.row.id">
              <el-button type="text" size="mini" icon="el-icon-edit"
                >编辑课程大纲</el-button
              >
            </router-link>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click="deleteCourse(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="current"
        :page-size="size"
        :total="total"
        style="padding: 30px 0; text-align: center"
        layout="total, prev, pager, next, jumper"
        @current-change="getCourseList"
      />
    </el-card>
  </div>
</template>

<script>
import courseApi from "@/api/edu/course";

export default {
  data() {
    return {
      /* 显示加载状态 */
      courseLoading: true,
      /* 课程列表数据 */
      courses: [],
      /* 课程查询对象 */
      courseQuery: {},
      /* 当前页 */
      current: 1,
      /* 当页显示数 */
      size: 5,
      /* 总记录数 */
      total: 0,
    };
  },
  created() {
    // 调用获取课程数据源
    this.getCourseList();
  },
  methods: {
    /* 获取课程数据源 */
    getCourseList(current = 1) {
      this.current = current;
      // 调用课程分页API
      courseApi
        .getCoursePageQuery(this.current, this.size, this.courseQuery)
        .then((res) => {
          // 设置课程列表数据
          this.courses = res.data.courses;
          // 设置总记录数
          (this.total = res.data.total),
            // 关闭加载状态
            (this.courseLoading = false);
        });
    },
    /* 删除课程 */
    deleteCourse(id) {
      this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用删除课程API
          courseApi.deleteCourse(id).then((res) => {
            console.log(res);
            // 提示
            this.$message.success("删除课程成功");
            // 刷新数据
            this.getCourseList();
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
  },
};
</script>

<style scoped>
.myClassList .info {
  width: 450px;
  overflow: hidden;
}

.myClassList .info .pic {
  width: 150px;
  height: 90px;
  overflow: hidden;
  float: left;
}

.myClassList .info .pic a {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.myClassList .info .pic img {
  display: block;
  width: 100%;
}

.myClassList td .info .title {
  width: 280px;
  float: right;
  height: 90px;
}

.myClassList td .info .title a {
  display: block;
  height: 48px;
  line-height: 24px;
  overflow: hidden;
  color: #00baf2;
  margin-bottom: 12px;
}

.myClassList td .info .title p {
  line-height: 20px;
  margin-top: 5px;
  color: #818181;
}
</style>