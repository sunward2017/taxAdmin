<template>
  <div class="app-container">
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.value" placeholder="请输入机器人ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <template>
      <Grid :columns="robotSaleColumns" :rows="tableData" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
        :isDelete="true" />
    </template>
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form :model="formModel" label-width="90px" :rules="formRules" ref="formRef">
        <el-col :span="24">
          <el-form-item label="机器人ID" prop="robotId">
            <el-input v-model="formModel.robotId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="客户ID" prop="cId">
            <el-input v-model="formModel.cId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="客户名称" prop="cName">
            <el-input v-model="formModel.cName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="电话" prop="phone">
            <el-input v-model="formModel.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="销售时间" prop="saleTime">
            <el-date-picker v-model="formModel.saleTime" type="date" style="width: 100%;" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="价格" prop="price">
            <el-input v-model="formModel.price"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="memo">
            <el-input v-model="formModel.memo"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="isSubmitting">{{submitBtnText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import Grid from '../../components/Grid/Grid'
  import {
    robotSaleColumns
  } from '../../dictionary/columns'
  import {
    robotSaleList,
    saveSaleRobot,
    deleteSaleRobot
  } from '@/api/robot'
  export default {
    components: {
      Grid
    },
    data() {
      return {
        filters: {
          value: ''
        },
        formTitle: '',
        formVisible: false,
        formModel: {
          robotId: '',
          cId: '',
          cName: '',
          phone:'',
          saleTime:'',
          price:'',
          operateName:'',
          memo:''
        },
        isSubmitting: false,
        submitBtnText: '保存',
        action: '',
        formRules: {

        },
        robotSaleColumns: robotSaleColumns,
        currentPage: 1,
        listLoading: true,
        listQuery: {

        },
        tableData: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        robotSaleList({}).then(res => {
          this.listLoading = false;
          this.tableData = res.data;
        });
      },
      handleSearch() {
        this.listLoading = true;
        if (this.filters.value == '') {
          robotSaleList({}).then(res => {
            this.listLoading = false;
            this.tableData = res.data;
          });
        } else {
          robotSaleList({
            robotId: this.filters.value
          }).then(res => {
            this.listLoading = false;
            this.tableData = res.data;
          });
        }

      },
      handleAdd() {
        this.formTitle = '新增';
        this.action = 'add';
        this.formVisible = true;
      },
      handleEdit(r) {
        this.formTitle = "编辑";
        this.action = 'edit';
        this.formVisible = true;
        this.formModel = Object.assign(r);
      },
      handleDel(r) {
        this.$confirm("确认删除机器人" + r.robotId + "的销售记录吗？", '提示', {

        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          deleteSaleRobot({
            Action: 2,
            robotId: r.robotId,
            id:r.id
          }).then((res) => {
            this.listLoading = false;
            NProgress.done();
            if (res.result == '200') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              this.getList();
            } else {
              this.$notify({
                title: '成功',
                message: res.body.message,
                type: 'error'
              });
            }
            this.formVisible = false;
          });
        }).catch(() => {

        });
      },
      handleSubmitForm() {
        let params = Object.assign(this.formModel);
        params.saleTime = new Date(params.saleTime).toLocaleDateString();
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
              if (this.action === 'add') {
                saveSaleRobot({ ...params,
                  Action: 0
                }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result == '200') {
                    this.$notify({
                      title: '成功',
                      message: '新增成功',
                      type: 'success'
                    });

                    this.getList();
                  } else {
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
                  this.formVisible = false;
                });
              } else {
                saveSaleRobot({ ...params,
                  Action: 1
                }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result == '200') {
                    this.$notify({
                      title: '成功',
                      message: '编辑成功',
                      type: 'success'
                    });

                    this.getList();
                  } else {
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
                  this.formVisible = false;
                });
              }
            })
          } else {

          }
        });
      }
    }
  }

</script>

