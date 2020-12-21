<template>
  <div class="advert-sapce-list">
    <el-card class="box-card">
      <div slot="header">
        <el-button size="small" @click="$router.push('/advert-space/addAdvertSpace')">添加广告位</el-button>
      </div>
      <el-table
        :data="formatSpaceList"
        v-loading="showTableLoading"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="spaceKey"
          label="spaceKey"
          width="120">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="广告位名称"
          width="260">
        </el-table-column>
        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="260">
        </el-table-column>
        <el-table-column
          align="center"
          prop="updateTime"
          label="更新时间"
          width="260">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini"
              @click="$router.push({
                path: '/advert-space/editAdvertSpace',
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
import { getAllSpaces } from '@/services/advert'

export default Vue.extend({
  name: 'AdvertSpaceList',
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
    formatSpaceList () {
      return (this as any).spaceList.map((item: any) => {
        if (item.createTime) {
          item.createTime = item.createTime.replace('T', ' ')
          const index = item.createTime.indexOf('.')
          item.createTime = item.createTime.substring(0, index)
        }
        if (item.updateTime) {
          item.updateTime = item.updateTime.replace('T', ' ')
          const index = item.updateTime.indexOf('.')
          item.updateTime = item.updateTime.substring(0, index)
        }
        return item
      })
    }
  },
  created () {
    this.getAllSpaceList()
  },
  methods: {
    async getAllSpaceList () {
      const { data } = await getAllSpaces()
      this.spaceList = data.content
    },
    handleSizeChange (val: any) {
      this.form.size = val
    },
    handleCurrentChange (val: any) {
      this.form.current = val
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
