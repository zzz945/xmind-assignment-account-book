<template>
  <div class="account-book">
    <el-form
      ref="form" 
      :model="formData"
      :inline="true" 
      :rules="formRules" 
      size="small" 
    >
      <el-form-item label="选择月份" prop="month">
        <el-date-picker
          v-model="formData.month"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月份"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="选择分类" prop="categories">
        <el-select
          v-model="formData.categories"
          multiple
          clearable
          filterable
          remote
          :remote-method="fetchCategory"
          @focus="handleCategorySelectFocus"
          placeholder="选择分类">
          <el-option
            v-for="option in categories"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>      
      <el-button type="primary" size="small" @click="fetchData">查询</el-button>
      <el-button size="small" @click="addBillDialogVisible = true">创建账单</el-button>
    </el-form>
    <el-card header="总览" shadow="never">
      <ul class="summery">
        <li v-for="(item, index) in statisticsByType" :key="index">{{`${item.type}: ${item.total_amount}`}}</li>
      </ul>
    </el-card>
    <br>
    <el-card header="分类统计" shadow="never">
      <div ref="billStasticsChart" class="bill-stastics-chart"></div>  
    </el-card>
    <br>
    <el-card header="账单明细" shadow="never">
      <el-table
        :data="billList"
        style="width: 100%">
        <el-table-column
          prop="time"
          label="日期"
        >
        </el-table-column>      
        <el-table-column
          prop="type"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          prop="category"
          label="分类"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额(￥)">
        </el-table-column>
      </el-table> 
    </el-card>
    <add-bill-dialog :visible.sync="addBillDialogVisible" 
      :month="formData.month"
      @success="fetchData" />
  </div>
</template>

<script>

import Api from './api'
import Echarts from 'echarts'
import AddBillDialog from './add-bill-dialog'

export default {
  name: 'AccountBook',
  components: {
    AddBillDialog
  },
  data () {
    return {
      formData: {
        month: null,
        categories: null,
      },
      formRules: {},     
      billList: [],
      statistics: [],
      statisticsByType: [],
      categories: [],
      billStasticsChart: null,
      addBillDialogVisible: false,
    }
  },
  created () {
    const {
      month = '2019-07',
      categories,
    } = this.$queryToData()

    this.formData = {
      month,
      categories: categories ? JSON.parse(categories) : null,
    }
  },
  mounted () {
    this.billStasticsChart = Echarts.init(this.$refs.billStasticsChart);
    this.fetchData()
  },
  methods: {
    fetchData () {
      const { month, categories } = this.formData
      const data = {
        month,
        categories: categories && categories.length ? JSON.stringify(categories) : undefined,
      }
      this.$dataToQuery(data)

      this.$refs.form.validate(async valid => {
        if (valid) {
          Api.getBillList(data).then(({ 
            list, 
            statistics, 
            statisticsByType
          }) => {
            this.billList = list
            this.statistics = statistics
            this.statisticsByType = statisticsByType
            this.updateBarChart(statistics)
          }).catch(e => {
            this.$apiError(e)
          })
        }
      })
    },
    handleCategorySelectFocus () {
      this.fetchCategory('')
    },
    fetchCategory (queryString) {
      Api.getCategories({
        name: queryString
      }).then(({ list }) => {
        this.categories = list.map(({ id, name }) => {
          return {
            value: id,
            label: name,
          }
        })
      }).catch(e => {
        this.$apiError(e)
      })
    },
    updateBarChart (statistics) {
      const source = statistics.map(({ category, total_amount }) => {
        return [category, total_amount]
      })

      const option = {
        dataset: {
          source,
        }, 
        xAxis: {
          type: 'value', 
          name: '金额(￥)'
        },
        yAxis: {
          type: 'category', 
          name: '分类',
          axisTick: {
            show: false
          },
        },
        series: [
          {
            type: 'bar', 
            label: {
              show: true,
            },            
          }
        ]
      };

      this.billStasticsChart.setOption(option);      
    },
  }
}
</script>

<style scoped>

.bill-stastics-chart {
  width: 100%;
  height: 300px;
}

.summery {
  display: flex;
  justify-content: space-around;
}

.account-book >>> .el-card__header,
.account-book >>> .el-card__body {
  padding: 10px 20px;
}

</style>
