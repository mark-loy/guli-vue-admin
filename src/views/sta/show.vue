<template>
  <div class="app-container">
    <!--表单-->
    <el-form
      :inline="true"
      :rules="searchObjRule"
      :model="searchObj"
      ref="searchObjRef"
      class="demo-form-inline"
    >
      <el-form-item prop="type">
        <el-select v-model="searchObj.type" clearable placeholder="请选择">
          <el-option label="学员登录数统计" value="login_num" />
          <el-option label="学员注册数统计" value="register_num" />
          <el-option label="课程播放数统计" value="video_view_num" />
          <el-option label="每日课程数统计" value="course_num" />
        </el-select>
      </el-form-item>
      <el-form-item prop="begin">
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item prop="end">
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()"
        >查询</el-button
      >
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height: 500px; width: 100%" />
    </div>
  </div>
</template>

<script>
import staApi from "@/api/sta/daily";
import echarts from "echarts";

export default {
  data() {
    return {
      /* 统计数据查询条件 */
      searchObj: {
        type: "",
        begin: "",
        end: "",
      },
      /* 查询条件表单验证规则 */
      searchObjRule: {
        type: [
          {
            required: true,
            message: "请选择统计因子",
            trigger: "change",
          },
        ],
        begin: [
          {
            required: true,
            message: "请选择开始日期",
            trigger: "change",
          },
        ],
        end: [
          {
            required: true,
            message: "请选择结束日期",
            trigger: "change",
          },
        ],
      },
      /* 控制查询按钮 */
      btnDisabled: false,
      /* 统计图对象 */
      chart: null,
      /* 统计图标题 */
      title: "",
      /* x轴数据 */
      xData: [],
      /* y轴数据 */
      yData: [],
    };
  },
  methods: {
    /* 展示图表数据 */
    showChart() {
      this.$refs["searchObjRef"].validate((valid) => {
        if (valid) {
          // 禁用查询按钮
          this.btnDisabled = true;
          // 调用api
          staApi.getStaData(this.searchObj).then((res) => {
            // 设置x轴数据
            this.xData = res.data.dates;
            // 设置y轴数据
            this.yData = res.data.types;
            // 设置统计图标题
            switch (this.searchObj.type) {
              case "register_num":
                this.title = "注册人数统计";
                break;
              case "login_num":
                this.title = "登录人数统计";
                break;
              case "video_view_num":
                this.title = "上传视频数统计";
                break;
              case "course_num":
                this.title = "课程数统计";
                break;
              default:
                break;
            }
            // 显示统计图
            this.setChart();
            // 启用查询按钮
            this.btnDisabled = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 设置统计图参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById("chart"));
      // 指定图表的配置项和数据
      var option = {
        // 设置统计图标题
        title: {
          text: this.title,
        },
        /* 鼠标提示 */
        tooltip: {
          trigger: "axis",
        },
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: "category",
          data: this.xData,
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: "value",
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [
          {
            // 系列中的数据内容数组
            data: this.yData,
            // 折线图
            type: "line",
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style>
</style>