<template>
  <el-dialog
    class="add-bill-dialog"
    title="新建账单"
    :visible.sync="visible"
    width="60%"
    :before-close="handleClose">
    <el-form
      ref="form" 
      :model="formData"
      :inline="true" 
      :rules="formRules" 
      size="small" 
    >
      <el-form-item label="选择时间" prop="time" required>
        <el-date-picker
          v-model="formData.time"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择月份"
          :clearable="false"
        />
      </el-form-item>
      <el-form-item label="选择类型" prop="type" required>
        <el-select
          v-model="formData.type"
          placeholder="选择类型">
          <el-option
            v-for="option in typeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>       
      <el-form-item label="选择分类" prop="category" required>
        <el-select
          v-model="formData.category"
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
      <el-form-item label="金额(￥)" prop="amount" required>
        <el-input-number v-model="formData.amount" :precision="2" :controls="false"></el-input-number>
      </el-form-item>                 
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import Api from './api'
import moment from 'moment'
import { billType } from './consts'

export default {
  name: 'AddBillDialog',
  props: ["month", "visible"],
  components: {
  },
  data () {
    return {
      formData: {},
      formRules: {},
      categories: [],
      typeOptions: Object.keys(billType.BILL_TYPE_TEXT).map(type => {
        return {
          value: type,
          label: billType.BILL_TYPE_TEXT[type]
        }
      })
    }
  },
  created () {
    this.reset()
  },
  methods: {
    reset () {
      this.formData = {
        time: moment(this.month).format('YYYY-MM-DD HH:mm:ss'),
        category: null,
        type: null,
        amount: null,
      }
    },
    handleClose () {
      this.reset()
      this.$emit('update:visible', false)
    },
    handleConfirm () {
     this.$refs.form.validate(async valid => {
        if (valid) {
          Api.insertBill(this.formData).then(() => {
            this.reset()
            this.$emit('update:visible', false)
            this.$emit('success')
          }).catch(e => {
            this.$apiError(e)
          }) 
        }
      })
    },
    handleCancel () {
      this.reset()
      this.$emit('update:visible', false)
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
  }
}
</script>

<style scoped>

</style>>

