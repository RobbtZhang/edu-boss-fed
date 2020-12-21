<template>
  <div class="advert-list">
    <el-card class="box-card">
      <div slot="header">
        <el-button size="small" @click="$router.push('/advert/addAdvert')">添加广告</el-button>
      </div>
      <el-table
        :data="adverListHasSpace"
        v-loading="showTableLoading"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="广告名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="spaceName"
          label="广告位置"
          width="160">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="广告图片"
          width="210">
          <template slot-scope="scope">
            <div :style="`width: 200px;height: 100px;background-image: url('${scope.row.img}');background-size: contain;background-repeat: no-repeat;`"></div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="时间"
          width="280">
          <template slot-scope="scope">
            <div>开始时间：{{scope.row.startTimeFormatString}}</div>
            <div>到期时间：{{scope.row.endTimeFormatString}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="上线/下线">
          <template slot-scope="scope">
            <el-switch @change="changeStatus(scope.row)" v-model="scope.row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini"
              @click="$router.push({
                path: '/advert/editAdvert',
                query: {
                  id: scope.row.id
                }
              })"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="showTableLoading"
        background
        :hide-on-single-page="totalPage/form.size<=1"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAdList, getAllSpaces, updateStatus } from '@/services/advert'

export default Vue.extend({
  name: 'AdvertList',
  data () {
    return {
      advertList: [],
      spaceList: [],
      showTableLoading: false,
      totalPage: 0,
      form: {
        current: 1,
        size: 5
      }
    }
  },
  computed: {
    adverListHasSpace () {
      return (this as any).advertList.map((advert: any) => {
        for (let i = 0; i < this.spaceList.length; i++) {
          if ((this.spaceList[i] as any).id === advert.spaceId) {
            advert.spaceName = (this.spaceList[i] as any).name
          }
        }
        return advert
      })
    }
  },
  created () {
    this.getAdListAll()
  },
  methods: {
    async getAdListAll () {
      const { data } = await getAdList({
        pageSize: this.form.size,
        pageNum: this.form.current
      })
      this.advertList = data.content
      this.totalPage = data.content.length
      const { data: spaceData } = await getAllSpaces()
      this.spaceList = spaceData.content
    },
    handleSizeChange (val: any) {
      this.form.size = val
    },
    handleCurrentChange (val: any) {
      this.form.current = val
    },
    async changeStatus (r: any) {
      this.$confirm('是否修改上线/下线状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await updateStatus({
          id: r.id,
          status: r.status
        })
        if (data.state === 1) {
          this.$message.success('修改成功')
        }
      }).catch(() => {
        r.status === 1 ? r.status = 0 : r.status = 1
        console.log(r.status)
        this.$message.warning('已取消修改')
      })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
