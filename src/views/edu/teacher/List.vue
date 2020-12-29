<template>
  <div>
    <el-card>
      <!--讲师条件查询表单-->
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="teacherQuery.name" placeholder="讲师名" />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="teacherQuery.level"
            clearable
            placeholder="讲师头衔"
          >
            <el-option :value="1" label="高级讲师" />
            <el-option :value="2" label="首席讲师" />
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="teacherQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="teacherQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getTeachers()"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form>

      <!-- 讲师表格 -->
      <el-table :data="teachers" border fit highlight-current-row>
        <el-table-column label="序号" width="70" align="center" type="index">
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120" />

        <el-table-column label="头衔" width="120">
          <template slot-scope="scope">
            {{ scope.row.level === 1 ? "高级讲师" : "首席讲师" }}
          </template>
        </el-table-column>

        <el-table-column prop="intro" label="资历" />

        <el-table-column prop="gmtCreate" label="添加时间" width="160" />

        <el-table-column prop="sort" label="排序" width="60" />

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/teacher/edit/' + scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit"
                >修改</el-button
              >
            </router-link>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeTeacherById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getTeachers"
        :current-page="current"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";

export default {
  data() {
    return {
      /* 讲师列表数据 */
      teachers: [],
      /* 当前页码 */
      current: 1,
      /* 当页显示数 */
      size: 5,
      /* 查询讲师条件对象 */
      teacherQuery: {},
      /* 总记录数 */
      total: 0,
    };
  },
  created() {
    /* 加载讲师列表数据 */
    this.getTeachers();
  },
  methods: {
    /* 获取讲师列表数据 */
    getTeachers(current = 1) {
      // 设置当前页
      this.current = current;
      // 调用讲师列表api
      teacherApi
        .getTeacherList(this.current, this.size, this.teacherQuery)
        .then((res) => {
          this.teachers = res.data.teachers;
          this.total = res.data.total;
        });
    },
    /* 根据id删除讲师 */
    removeTeacherById(id) {
      // 确认弹框
      this.$confirm("此操作将永久删除讲师记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        teacherApi.removeTeacher(id).then((res) => {
          // 提示
          this.$message.success("删除讲师成功");
          // 刷新页面数据
          this.getTeachers();
        });
      }).catch(() => {

      });
    },
    /* 分页，处理每页显示数改变 */
    handleSizeChange(size) {
      // 设置新的每页显示数
      this.size = size;
      /* 刷新数据 */
      this.getTeachers(this.current);
    },
    /* 清空条件查询表单数据 */
    resetData() {
      this.teacherQuery = {};
      this.getTeachers();
    },
  },
};
</script>

<style>
</style>