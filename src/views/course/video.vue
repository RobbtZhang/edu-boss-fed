<template>
  <div class="course-video">
    <el-form label-width="100px">
      <el-form-item label="课程">
        <el-input disabled v-model="courseName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="课时">
        <el-input disabled v-model="lessonName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="视频上传">
        <el-button style="position:relative;margin-right: 10px;" type="primary">
          <input type="file"
            @change="videoUpload"
            ref="video"
            style="opacity:0;width:100%;height:100%;position:absolute;top:0;left:0;">
          选择视频
        </el-button> {{videoName}}
      </el-form-item>
      <el-form-item label="封面上传">
        <el-button style="position:relative;;margin-right: 10px;" type="primary">
          <input type="file"
            @change="imageUpload"
            ref="image"
            style="opacity:0;width:100%;height:100%;position:absolute;top:0;left:0;">
          选择封面
        </el-button> {{imageName}}
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          @click="handleUpload"
        >开始上传</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
      <el-form-item>
        <p v-if="isUpload"
        >视频上传中：{{ uploadPercent }}</p>
        <p v-if="isUploadSuccess"
        >视频转码中：{{ isTranCodeSuccess ? '完成' : '转码中，请稍后' }}</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getAliyunVideoUploadAddressAdnAuth,
  getAliyunImagUploadAddressAdnAuth,
  aliyunTransCode,
  getAliyunTransCodePercent
} from '@/services/aliyun-upload'
export default Vue.extend({
  name: 'CourseVideo',
  data () {
    return {
      uploader: null,
      videoName: '',
      imageName: '',
      imageUrl: '',
      videoId: null,
      isUpload: false,
      uploadPercent: 0,
      isUploadSuccess: false,
      isTranCodeSuccess: false
    }
  },
  props: {
    courseId: {
      type: [Number, String],
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    lessonName: {
      type: String,
      required: true
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    videoUpload () {
      this.videoName = (this.$refs.video as any).files[0].name
    },
    imageUpload () {
      this.imageName = (this.$refs.image as any).files[0].name
    },
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
      // 阿里账号ID，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          // console.log('onUploadstarted', uploadInfo)
          // 1. 通过我们后端获取文件上传凭证
          let uploadAddressAndAuth
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await getAliyunImagUploadAddressAdnAuth()
            uploadAddressAndAuth = data.data
            this.imageUrl = data.data.imageURL
          } else {
            const { data } = await getAliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl // 先要上传图片
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }
          // 2. 调用uploader.setUploadAuthAndAddress设置上传凭证
          (this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 3. 设置好上传凭证没问题，上传进度开始
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          // console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          // console.log('onUploadFailed', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo: any, totalSize: any, loadedPercent: any) => {
          // console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent) * 100
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo: any) {
          // console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          // console.log('onUploadEnd', uploadInfo)
          // 请求转码
          this.isUploadSuccess = true
          this.isUpload = false
          const { data } = await aliyunTransCode({
            lessonId: this.$route.query.lessonId,
            coverImageUrl: this.imageUrl,
            fileName: this.videoName,
            fileId: this.videoId
          })
          // console.log(data)
          // 轮询查询转码进度
          const timer = setInterval(async () => {
            const { data } = await getAliyunTransCodePercent(this.$route.query.lessonId)
            // console.log(data.data)
            if (data.data === 100) {
              this.isTranCodeSuccess = true
              window.clearInterval(timer)
              // console.log('转码成功')
            }
          }, 3000)
        }
      })
    },
    handleUpload () {
      // 初始化上传状态
      this.isUpload = true
      this.isUploadSuccess = false
      this.isTranCodeSuccess = false
      this.uploadPercent = 0
      // 获取上传的文件
      const videoFile = (this.$refs.video as any).files[0]
      const imageFile = (this.$refs.image as any).files[0]
      // 将文件添加到上传文件列表
      ;(this.uploader as any).addFile(imageFile, null, null, null, '{"Vod":{}}')
      ;(this.uploader as any).addFile(videoFile, null, null, null, '{"Vod":{}}')
      // 开始上传 按列表顺序上传
      ;(this.uploader as any).startUpload()
    }
  }
})
</script>

<style lang="scss" scoped>
.course-video {
  width: 50%;
  margin: 0 auto;
}
</style>
