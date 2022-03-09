<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="marginbottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder="示例：机器学习项目课：从基础到搭建项目视频。专业名称注意大小写"
        />
      </el-form-item>
      <!-- 所属分类 -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          @change="topSubjectChanged"
          placeholder="一级分类"
        >
          <el-option
            v-for="topSubject in topSubjectList"
            :key="topSubject.id"
            :label="topSubject.title"
            :value="topSubject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="二级分类"
        >
          <el-option
            v-for="subject in secondSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择"
        >
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce
          :height="300"
          v-model="courseInfo.description"
        />
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <!-- 
              show-file-list：显示文件列表
              on-success：上传成功后调用的方法
              before-upload：上传之前调用的方法
              action：上传的接口地址

           -->
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/file-oss/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>
      <!-- 课程价格 -->
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder=""
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
        >保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import teacher from "@/api/edu/teacher";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce"; //引入富文本编辑器组件
export default {
  //声明富文本编辑器组件
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        title: "",
        subjectId: "", //二级分类id
        subjectParentId: "", //一级分类id
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "Java.jpg",
        price: 0,
      },
      courseId: "",
      teacherList: [],
      topSubjectList: [], //一级分类
      secondSubjectList: [], //二级分类
      BASE_API: process.env.VUE_APP_BASE_API,
    };
  },
  created() {
    //实现返回该页面实现数据回显
    //初始化所有讲师
    this.getListTeacher();
    //获取路由id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      //根据课程id查询课程基本信息
      this.getCourseInfo()
    } else {
      //初始化一级分类
      this.getAllSubject();
    }
    console.log("info created");
  },
  methods: {
    //根据课程id查询课程基本信息
    getCourseInfo() {
      course.getCourseInfo(this.courseId).then((result) => {
        this.courseInfo = result.data.courseInfoVo
        //1.查询所有分类，包含一级和二级
        subject.getAllSubject().then((result) => {
          //2.获取所有一级分类
          this.topSubjectList = result.data.list
          //3.把所有一级分类的数组进行遍历，
          for (var i = 0; i < this.topSubjectList.length; i++) {
            //获取每个一级分类
            var topSubject = this.topSubjectList[i]
            //比较当前courseInfo里面一级分类id和所有一级分类id
            if (this.courseInfo.subjectParentId == topSubject.id) {
              //获取一级分类里面所有二级分类
              this.secondSubjectList = topSubject.children
            }
          }
        })
      })
    },
    //上传封面成功调用方法
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url;
    },
    //上传之前调用的方法(用于校验文件格式、大小)
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //当点击某个一级分类，触发change 显示对应二级分类
    topSubjectChanged(value) {
      //value:选中的一级分类的id值
      console.log(value);
      //遍历所有分类
      for (let i = 0; i < this.topSubjectList.length; i++) {
        if (this.topSubjectList[i].id === value) {
          this.secondSubjectList = this.topSubjectList[i].children;
          this.courseInfo.subjectId = ""; //每次重新选择一级分类时,清空二级分类选择的值
        }
      }
    },
    //查询所有分类
    getAllSubject() {
      subject.getAllSubject().then((result) => {
        this.topSubjectList = result.data.list;
      });
    },
    //查询所有讲师
    getListTeacher() {
      teacher.findAllTeacher().then((result) => {
        this.teacherList = result.data.teacherList;
      });
    },
    //添加课程
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then((result) => {
          //提示信息
          this.$message({
            type: "success",
            message: "添加课程信息成功！",
          });
          //跳转到第二步
          console.log("next");
          this.$router.push({ path: "/course/chapter/" + result.data.courseId });
        });
    },
    //修改课程
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
        .then((result) => {
          //提示信息
          this.$message({
            type: "success",
            message: "修改课程信息成功！",
          });
          //跳转到第二步
          console.log("next");
          this.$router.push({ path: "/course/chapter/" + this.courseId });
        })
    },
    saveOrUpdate() {
      //判断添加还是修改课程
      if (!this.courseId) {
        //添加
        this.addCourse()
      } else {
        //修改
        this.updateCourse()
      }
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>