<template>
  <div>
    <div id="main" style="width: 750px; height: 400px"></div>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import _ from 'lodash'
var echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/line')
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },

  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 绘制图表
    const { data: ret } = await this.$http.get('reports/type/1')
    if (ret.meta.status !== 200) return this.$message.error('获取报表失败')
    const res = _.merge(this.options, ret.data)
    console.log(res)
    myChart.setOption(res)
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
