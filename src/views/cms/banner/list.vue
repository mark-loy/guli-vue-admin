<template>
  <div>
    <el-card>
      <router-link to="/cms/banner/add">
        <el-button type="success" size="primary" icon="el-icon-save"
          >添加banner</el-button
        >
      </router-link>

      <!-- banner列表 -->
      <el-table :data="banners" border fit highlight-current-row style="margin-top: 15px">
        <el-table-column label="#" width="70" align="center" type="index" />
        <el-table-column prop="title" label="标题" width="320" />

        <el-table-column label="banner封面" width="520">
          <template slot-scope="scope">
            <el-image
              style="width: 520px; height: 100px"
              :src="scope.row.imageUrl"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>

        <el-table-column prop="linkUrl" label="链接地址" />
        <el-table-column prop="sort" label="排序" width="120" />

        <el-table-column prop="gmtCreate" label="创建时间" width="160" />

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <router-link :to="'/cms/banner/update/' + scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit"
                >修改</el-button
              >
            </router-link>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeBannerById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="getBannerPage"
        :current-page="current"
        :page-sizes="[5, 10, 20, 40]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import bannerApi from "@/api/cms/banner";

export default {
  data() {
    return {
      /* banner列表数据 */
      banners: [],
      /* banner总数 */
      total: 0,
      /* 当前页 */
      current: 1,
      /* 当页显示数 */
      limit: 5,
    };
  },
  created() {
    this.getBannerPage();
  },
  methods: {
    /* 获取banner分页数据 */
    getBannerPage(current = 1) {
      this.current = current;
      // 调用api
      bannerApi.selectBannerPage(this.current, this.limit).then((res) => {
        this.banners = res.data.banners;
        this.total = res.data.total;
      });
    },
    /* 删除banner */
    removeBannerById(bid) {
      this.$confirm("此操作将永久删除该banner, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用api
          bannerApi.deleteBanner(bid).then((res) => {
            // 提示
            this.$message.success("banner删除成功");
            // 刷新数据
            this.getBannerPage();
          });
        })
        .catch(() => {
          console.log("取消删除");
        });
    },
    /* 当页显示数改变 */
    handleSizeChange(limit) {
      this.limit = limit;
      this.getBannerPage();
    },
  },
};
</script>

<style>
</style>