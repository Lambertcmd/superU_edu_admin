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
export default {
  data() {
    return {
      teacher: {},
      saveBtnDisabled: false, //点击一次后按钮是否被禁用
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
  },
};
</script>