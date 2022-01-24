<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="OSS_PATH + '/excel/subject.xlsx'">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <!-- 
              auto-upload:自动上传 
              limit:每次提交的文件数量 
              accept:限制可上传的文件
              action:提交给后端的接口路径
           -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduservice/edu-subject/addSubject'"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      BASE_API: process.env.VUE_APP_BASE_API, //接口API地址
      OSS_PATH: process.env.VUE_APP_OSS_PATH, //阿里云OSS地址
      importBtnDisabled: false, //按钮是否禁用
      loading: false,
    };
  },
  created() {},
  methods: {
    //点击按钮上传文件到接口
    submitUpload() {
      this.importBtnDisabled = true;
      this.loading = true;
      this.$refs.upload.submit();//upload指组件的属性ref的值
    },
    //上传成功
    fileUploadSuccess(response) {
        this.loading = false
        //提示信息
        this.$message({
            type: "success",
            message: "添加课程分类成功!"
        })
        //跳转到课程分类列表
        this.$router.push({path:"/subject/list"})
    },
    //上传失败
    fileUploadError(response) {
        this.loading = false
        //提示信息
        this.$message({
            type:"error",
            message:"添加课程分类失败!"
        })
    },
  },
};
</script>