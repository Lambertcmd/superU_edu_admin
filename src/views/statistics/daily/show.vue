<template>
  <div class="app-container">
    <!--表单-->
    <el-form
      :inline="true"
      class="demo-form-inline"
    >
      <!-- <el-form-item>
        <el-select
          v-model="searchObj.type"
          clearable
          placeholder="请选择"
        >
          <el-option
            label="学员登录数统计"
            value="login_num"
          />
          <el-option
            label="学员注册数统计"
            value="register_num"
          />
          <el-option
            label="课程播放数统计"
            value="video_view_num"
          />
          <el-option
            label="每日课程数统计"
            value="course_num"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()"
      >查询</el-button>
    </el-form>
    <div class="chart-container">
      <div
        id="chart"
        class="chart"
        style="height:500px;width:100%"
      />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import dailyStatistics from '@/api/statistics/daily';
export default {
  data() {
    return {
      searchObj: {
        begin: "",
        end: "",
      },
      btnDisabled: false, //按钮禁用
      chart: null,
      title: '',
      loginData: [],
      registerData: [],
      videoViewData: [],
      newCourseData: []
    }
  },
  created() {

  },
  methods: {
    showChart() {
      this.initChartData()
      //   this.setChart()
    },
    // 准备图表数据
    initChartData() {
      dailyStatistics.showChart(this.searchObj)
        .then((result) => {
          //x轴时间
          this.xData = result.data.dateCalculatedList
          //学员登录数
          this.loginData = result.data.loginNumList
          this.registerData = result.data.registerNumList
          this.videoViewData = result.data.videoViewNumList
          this.newCourseData = result.data.courseNumList
          this.setChart()
        })
    },
    // 设置图标参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'))
      // console.log(this.chart)
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '学院流量统计'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['学员登录数统计', '学员注册数统计', '课程播放数统计', '每日课程数统计']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '学员登录数统计',
            type: 'line',
            stack: 'Total',
            data: this.loginData
          },
          {
            name: '学员注册数统计',
            type: 'line',
            stack: 'Total',
            data: this.registerData
          },
          {
            name: '课程播放数统计',
            type: 'line',
            stack: 'Total',
            data: this.videoViewData
          },
          {
            name: '每日课程数统计',
            type: 'line',
            stack: 'Total',
            data: this.newCourseData
          }
        ],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'
          },
          textStyle: {
            color: '#fff'
          },
          borderColor: '#90979c'
        },
        {
          type: 'inside',
          show: true,
          height: 12,
          start: 1,
          end: 35
        }]
      };
      this.chart.setOption(option)
    }
  }
}
</script>