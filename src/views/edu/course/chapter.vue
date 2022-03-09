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
    >添加章节</el-button>
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
    <div>
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
        <el-form-item label="上传视频">
          <!-- TODO -->
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
        title: "",
        sort: 0
      },
      dialogVideoFormVisible: false,//添加小节的弹框是否显示
      video: {
        title: "",
        sort: 0,
        isFree: 0,
        videoSourceId: ""
      }
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
      })
    },

    //修改小节弹框数据回显
    openEditVideo(videoId) {
      //弹出弹框
      this.dialogVideoFormVisible = true
      //调用接口显示数据
      video.getVideoById(videoId).then((result) => {
        this.video = result.data.video
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
</style>