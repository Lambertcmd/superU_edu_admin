<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="marginbottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button
      type="text"
      @click="openChapterDialog()"
    >添加章节
    </el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id"
      >
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button
              type="text"
              @click="openVideo(chapter.id)"
            >添加小节</el-button>
            <el-button
              style=""
              type="text"
              @click="openEditChapter(chapter.id)"
            >编辑</el-button>
            <el-button
              type="text"
              @click="removeChapter(chapter.id)"
            >删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id"
          >
            <p>{{ video.title }}
              <span class="acts">
                <el-button
                  type="text"
                  @click="openEditVideo(video.id)"
                >编辑</el-button>
                <el-button
                  type="text"
                  @click="removeVideo(video.id)"
                >删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div class="centerButton">
      <el-button @click="previous">上一步</el-button>
      <el-button
        :disabled="saveBtnDisabled"
        type="primary"
        @click="next"
      >下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog
      :visible.sync="dialogChapterFormVisible"
      title="添加章节"
    >
      <el-form
        :model="chapter"
        label-width="120px"
      >
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controlsposition="right"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveOrUpdate"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog
      :visible.sync="dialogVideoFormVisible"
      title="添加课时"
    >
      <el-form
        :model="video"
        label-width="120px"
      >
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controlsposition="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 
            on-success:上传成功执行的操作
            on-remove:删除成功执行的操作
            before-remove:删除之前执行的操作，一般用于弹框是否确认删除
            on-exceed:上传之前执行的操作
            file-list:文件列表显示
            limit:允许上传文件的数量
         -->
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button
              size="small"
              type="primary"
            >上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G,<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from "@/api/edu/chapter"
import video from "@/api/edu/video"
export default {
  data() {
    return {
      saveVideoBtnDisabled: false,//添加/修改小节的"确定"按钮是否禁用
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: "",//课程id
      chapterVideoList: [],
      dialogChapterFormVisible: false,//添加章节的弹框是否启用
      chapter: {//封装章节的数据
        id:"",
        title: "",
        sort: 0
      },
      dialogVideoFormVisible: false,//添加小节的弹框是否显示
      video: {
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: "",
        videoOriginalName: ""  //视频名称
      },
      fileList: [],
      BASE_API: process.env.VUE_APP_BASE_API
    };
  },
  created() {
    console.log("chapter created");
    //获取路由的课程id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //根据课程id查询章节和小节
      this.getChapterVideo()
    }
  },
  methods: {

    //======================小节操作==============================
    //点击确定删除调用的方法
    handleVodRemove() {
      //调用删除视频接口
      video.removeVideoSourceById(this.video.videoSourceId)
        .then((result) => {
          //提示删除成功
          this.$message({
            type: "success",
            message: "视频删除成功!",
          });
          //清空文件列表
          this.fileList = []
          //把video里的视频id和视频名称清空
          this.video.videoSourceId = ""
          this.video.videoOriginalName = ""
        })
    },

    //点击x，删除视频之前调用的方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除视频 ${file.name} ?`)
    },
    //上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      //上传的视频id赋值给video对象
      this.video.videoSourceId = response.data.videoSourceId
      //上传的视频名称赋值给video对象
      this.video.videoOriginalName = file.name
      this.fileList = fileList
    },
    //上传视频之前调用的方法
    handleUploadExceed() {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频")
    },

    //删除小节
    removeVideo(videoId) {
      //1.删除前提示是否继续删除
      this.$confirm("此操作将删除小节,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //2.选择继续删除
        //3.调用删除记录的接口
        video.deleteVideo(videoId).then((result) => {
          //4.提示删除成功
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //5.刷新页面
          this.getChapterVideo()
        });
      });
    },



    //判断是添加还是修改小节
    saveOrUpdateVideo() {
      this.saveVideoBtnDisabled = true
      if (!this.video.id) {
        this.addVideo()
        //按钮取消禁用
      } else {
        this.updateVideo()
        //按钮取消禁用
      }
      //按钮取消禁用
      this.saveVideoBtnDisabled = false

    },
    //添加小节的弹框
    openVideo(chapterId) {
      //清空文件列表
      this.fileList = []
      //弹框
      this.dialogVideoFormVisible = true
      //按钮取消禁用
      this.saveVideoBtnDisabled = false
      //清空弹框内表单的内容
      this.video = {}
      //设置章节id
      this.video.chapterId = chapterId


    },

    //添加小节
    addVideo() {
      console.log("执行了添加小节")
      console.log(this.video.videoSourceId)
      //设置课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video).then((result) => {
        //关闭弹框
        this.dialogVideoFormVisible = false
        //提示信息
        this.$message({
          type: "success",
          message: "添加小节成功！",
        });
        //刷新页面
        this.getChapterVideo()
        //清空文件列表
        console.log(this.fileList.length)
        this.fileList = []
      })
    },

    //修改小节弹框数据回显
    openEditVideo(videoId) {
      //清空文件列表
      this.fileList = []
      //弹出弹框
      this.dialogVideoFormVisible = true
      //调用接口显示数据
      video.getVideoById(videoId).then((result) => {
        this.video = result.data.video
        console.log("fileList:" + this.fileList)
        if (this.video.videoOriginalName != null) {
          this.fileList.push({ name: this.video.videoOriginalName })
        }
        console.log(this.video.videoOriginalName)
        console.log("fileList:" + this.fileList)
      })
    },

    //修改小节
    updateVideo() {
      console.log("执行了修改小节")
      video.updateVideo(this.video).then((result) => {
        //关闭弹框
        this.dialogVideoFormVisible = false
        //提示信息
        this.$message({
          type: "success",
          message: "修改小节成功！",
        });
        //刷新页面(重新查一次章节小节)
        this.getChapterVideo()
      })
    },
    //======================章节操作==============================
    //删除章节
    removeChapter(chapterId) {
      //1.删除前提示是否继续删除
      this.$confirm("此操作将删除章节,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //2.选择继续删除
        //3.调用删除记录的接口
        chapter.deleteChapter(chapterId).then((result) => {
          //4.提示删除成功
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //5.刷新页面
          this.getChapterVideo()
        });
      });
    },
    //修改章节弹框数据回显
    openEditChapter(chapterId) {
      //弹框
      this.dialogChapterFormVisible = true
      //调用接口显示数据
      chapter.getChapterInfoById(chapterId).then((result) => {
        this.chapter = result.data.chapter
      })
    },

    //弹出添加章节页面
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      //表单数据清空
      this.chapter.title = ""
      this.chapter.sort = 0
    },

    //添加章节
    addChapter() {
      //设置课程id到chapter对象里
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter).then((result) => {
        //关闭弹框
        this.dialogChapterFormVisible = false
        //提示信息
        this.$message({
          type: "success",
          message: "添加章节成功！",
        });
        //刷新页面(重新查一次章节小节)
        this.getChapterVideo()
      })
    },
    //修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter).then((result) => {
        //关闭弹框
        this.dialogChapterFormVisible = false
        //提示信息
        this.$message({
          type: "success",
          message: "修改章节成功！",
        });
        //刷新页面(重新查一次章节小节)
        this.getChapterVideo()
        console.log(result.success)
      })
    },

    saveOrUpdate() {
      if (!this.chapter.id) {
        //没有id 添加操作
        this.addChapter()
      } else {//有id 修改操作
        this.updateChapter()
      }
    },

    //根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getChapterVideo(this.courseId)
        .then((result) => {
          this.chapterVideoList = result.data.chapterVideoList;
        })
    },
    previous() {
      console.log("previous");
      this.$router.push({ path: "/course/info/" + this.courseId });
    },
    next() {
      console.log("next");
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
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
.centerButton {
  text-align: center;
}
</style>