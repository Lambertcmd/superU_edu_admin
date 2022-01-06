<template>
  <div class="app-container">
    <el-form label-width="120px">
      <!-- 讲师名称 -->
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"></el-input>
      </el-form-item>
      <!-- 讲师排序 -->
      <el-form-item label="讲师排序">
        <el-input-number
          v-model="teacher.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <!-- 讲师头衔 -->
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" placeholder="请选择" clearable>
          <!-- 
            数据类型一定要和取出的json中的一致 否则没法回填,
            因此，这里value使用动态绑定的值，保证其数据类型是number
         -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <!-- 讲师资历 -->
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <!-- 讲师简介 -->
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像
        </el-button>
        <!--v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/eduoss/file-oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="saveOrUpdate"
          :disabled="saveBtnDisabled"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        avatar: "",
      },
      saveBtnDisabled: false, //点击一次后按钮是否被禁用
      imagecropperShow: false, //上传弹框的组件是否显示
      imagecropperKey: 0, //上传key组件
      BASE_API: process.env.VUE_APP_BASE_API, //获取den.development的地址
    };
  },
  created() {
    //判断路径是否有id值
    if (this.$route.params && this.$route.params.id) {
      //从路径获取id值
      const id = this.$route.params.id;
      //调用根据id查询讲师的方法
      this.getTeacher(id);
    }
  },
  methods: {
    //根据讲师id查询
    getTeacher(id) {
      teacherApi.getTeacher(id).then((result) => {
        this.teacher = result.data.teacher;
      });
    },
    saveOrUpdate() {
      /**
       * 判断修改还是添加（根据teacher中是否有id）
       */
      //无id 添加
      if (!this.teacher.id) {
        this.saveBtnDisabled = true;
        this.saveTeacher();
      } else {
        //有id 修改
        this.updateTeacher();
      }
    },
    //添加讲师的方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher).then((result) => {
        //1.提示添加成功信息
        this.$message({
          type: "success",
          message: "添加成功！",
        });
        //2.返回讲师列表（路由跳转）
        this.$router.push({ path: "/teacher/table" });
      });
    },
    //修改讲师的方法
    updateTeacher() {
      teacherApi.updateTeacher(this.teacher).then((result) => {
        //1.提示修改成功
        this.$message({
          type: "success",
          message: "修改成功！",
        });
        //2.返回讲师列表（路由跳转）
        this.$router.push({ path: "/teacher/table" });
      });
    },
    //关闭上传弹框的方法
    close() {
      this.imagecropperShow = false;
      //上传组件初始化 弹框关闭时再次点击可以重新选择图片
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    //上传成功的方法
    cropSuccess(data) {
      this.close();
      //上传之后接口返回图片地址,赋值给teacher.avatar
      this.teacher.avatar = data.url;
    },
  },
};
</script>