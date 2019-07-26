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
      <Grid :columns="robotRepairColumns" :rows="tableData" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
        :isDelete="true" />
    </template>
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form :model="formModel" label-width="90px" :rules="formRules" ref="formRef">
        <el-col :span="24">
          <el-form-item label="机器人编号" prop="robotId">
            <el-input v-model="formModel.robotId"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="送修人" prop="sendPerson">
            <el-input v-model="formModel.sendPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="送修人电话" prop="sendPhone">
            <el-input v-model="formModel.sendPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="送修日期" prop="sendDay">
            <el-date-picker v-model="formModel.sendDay" type="date" style="width: 100%;" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="问题描述" prop="problemDescribe">
            <el-input type="textarea" :rows="2" v-model="formModel.problemDescribe"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接收方" prop="recvName">
            <el-input v-model="formModel.recvName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="预估天数" prop="estimateDays">
            <el-input-number v-model="formModel.estimateDays" style="width: 100%;" :min="1"></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="memo">
            <el-input type="textarea" :rows="2" v-model="formModel.memo"></el-input>
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
    robotRepairColumns
  } from '../../dictionary/columns'
  import {
    robotRepairList,
    saveRepairRobot,
    deleteRepairRobot
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
          sendPerson: '',
          sendPhone: '',
          sendDay: '',
          problemDescribe: '',
          recvName: '',
          estimateDays: '',
          handlePerson: '',
          memo: ''
        },
        isSubmitting: false,
        submitBtnText: '保存',
        action: '',
        formRules: {

        },
        robotRepairColumns: robotRepairColumns,
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
        robotRepairList({}).then(res => {
          this.listLoading = false;
          this.tableData = res.data;
        });
      },
      handleSearch() {
        this.listLoading = true;
        if (this.filters.value == '') {
          robotRepairList({}).then(res => {
            this.listLoading = false;
            this.tableData = res.data;
          });
        } else {
          robotRepairList({
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
        this.$confirm("确认删除机器人" + r.robotId + "的维修记录吗？", '提示', {

        }).then(() => {
          this.listLoading = true;
          NProgress.start();
          deleteRepairRobot({
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
        // params.sendDay=111;
        params.sendDay = new Date(params.sendDay).toLocaleDateString();
        params.handlePerson = "";
        // console.log(new Date().toLocaleDateString());
        // console.log(new Date(params.sendDay));
        // console.log(params);
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
              if (this.action === 'add') {
                saveRepairRobot({ ...params,
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
                saveRepairRobot({ ...params,
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

