<template>
  <div>
    <el-card>
      <!--订单条件查询表单-->
      <el-form :inline="true" :model="orderQuery" ref="orderQueryRef">
        <el-form-item>
          <el-input v-model="orderQuery.orderNo" placeholder="订单号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="orderQuery.courseTitle" placeholder="课程名称" />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="orderQuery.status"
            clearable
            placeholder="支付状态"
          >
            <el-option :value="0" label="未支付" />
            <el-option :value="1" label="已支付" />
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="orderQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="orderQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getOrderPage()"
          >查询</el-button
        >
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form>

      <!-- 订单列表 -->
      <el-table :data="orders" border fit highlight-current-row>
        <el-table-column label="#" width="70" align="center" type="index" />
        <el-table-column prop="orderNo" label="订单号"  width="160"/>
        <el-table-column prop="courseTitle" label="课程名称" />

        <el-table-column prop="nickname" label="会员昵称" width="120" />
        <el-table-column prop="mobile" label="会员手机" width="120"/>

        <el-table-column prop="totalFee" label="订单金额（分）" width="120" />

        <el-table-column label="支付状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? "已支付" : "未支付" }}
          </template>
        </el-table-column>

        <el-table-column prop="gmtCreate" label="创建时间" width="160" />

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeOrderById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getOrderPage"
        :current-page="current"
        :page-sizes="[2, 10, 20, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import orderApi from "@/api/order/list";

export default {
  data() {
    return {
      /* 订单分页数据 */
      orders: [],
      /* 订单总数 */
      total: 0,
      /* 订单查询对象 */
      orderQuery: {
        /* 订单号 */
        orderNo: "",
        /* 课程名 */
        courseTitle: "",
        /* 开始创建时间 */
        begin: "",
        /* 结束创建时间 */
        end: "",
        /* 订单状态 */
        status: "",
      },
      /* 当前页 */
      current: 1,
      /* 当页显示数 */
      limit: 2,
    };
  },
  created() {
    /* 初始化数据 */
    this.getOrderPage();
  },
  methods: {
    /* 获取订单分页数据 */
    getOrderPage(current = 1) {
      this.current = current;
      /* 调用api */
      orderApi
        .selectOrderPage(this.current, this.limit, this.orderQuery)
        .then((res) => {
          // 设置data
          this.orders = res.data.orders;
          this.total = res.data.total;
        });
    },
    /* 清空条件查询表单 */
    resetData() {
      this.orderQuery = {};
      this.getOrderPage();
    },
    /* 删除订单 */
    removeOrderById(oid) {
      this.$confirm("此操作将永久删除该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          orderApi.deleteOrder(oid).then(res => {
            // 提示
            this.$message.success("订单删除成功")
            // 刷新数据
            this.getOrderPage()
          })
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    /* 当页显示数改变 */
    handleSizeChange(limit) {
      this.limit = limit;
      this.getOrderPage();
    },
  },
};
</script>

<style>
</style>