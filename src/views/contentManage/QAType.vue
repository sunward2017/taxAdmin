<template>
  <div class="app-container">

    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <!-- <el-form-item>
          <el-input v-model="filters.value" placeholder="请输入类别名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleSearch">查询</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <template>
      <Grid4QAType :columns="QATypeListColumns" :rows="tableData?tableData.slice((currentPage-1)*pageSize,currentPage*pageSize):tableData" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
        :isDelete="true" />
      <div style="float: right">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          small
          layout="total, prev, pager, next"
          :total="tableData?tableData.length:5">
        </el-pagination>
      </div>
    </template>

    <!--新增，编辑-->
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form :model="formModel" label-width="90px" :rules="formRules" ref="formRef">
        <!--<template v-if="this.action === 'edit'">-->
          <!--<el-col :span="24">-->
            <!--<el-form-item label="列号" >-->
              <!--<el-input v-model="formModel.id"></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</template>-->
        <!--<el-col :span="24">-->
          <!--<el-form-item label="类别ID" prop="typeId">-->
            <!--<el-input v-model="formModel.typeId"></el-input>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="24">
          <el-form-item label="类别名称" prop="typrName">
            <el-input v-model="formModel.typrName" style="width: 67%"></el-input>
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
  import Grid4QAType from '../../components/Grid/Grid4QAType'
  import {
    QATypeListColumns
  } from '../../dictionary/columns'
  import {
    QATypeList,
    saveQAType,
    QATypeDelete,
  } from '@/api/QA'
  import {getAccount } from '@/utils/auth'

  export default {
    components: {
      Grid4QAType
    },
    data() {
      var checkId= (rule,str, callback) => {
        let reg =  /^[1-9][0-9]*$/;
        let value = str.replace(/^\s*$/g,'');
        if(value===''){
          return callback(new Error('id不能为空'));
        }else if(!reg.test(value)) {
          return callback(new Error('id不正确,id应该为数字'));
        }else{
          callback();
        }

      };
      return {
//        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
        filters: {
          value: ''
        },
        formTitle: '',
        formVisible: false,
        formModel: {
          id:"",
          typeId:"",
          typrName: ''
        },
        isSubmitting: false,
        submitBtnText: '保存',
        action: '',
        formRules: {
            typeId:[{ required: true, validator:checkId, trigger: 'blur' }],
            typrName:[{ required: true, message: '请输入类别名', trigger: 'blur' }],
        },
        QATypeListColumns: QATypeListColumns,

        listLoading: true,
        listQuery: {
        },
        tableData: []
      }
    },
    created() {
      this.getList();
      this.initTable();

    },
    methods: {
//      每页显示条数发生改变
      handleSizeChange(pageSize){
        console.log("pageSize");
        console.log(pageSize);
        this.pageSize = pageSize;
      },
//      当前页发生改变
      handleCurrentChange(currentPage){
        console.log("currentPage");
        console.log(currentPage);
        this.currentPage  = currentPage;
      },
      initTable(){
        this.tableData=[];
      },
      getList() {
        this.listLoading = true;
        QATypeList({}).then(res => {

          this.tableData = res.data;
          console.log("this.tableData");
          console.log(this.tableData);
        });
        this.listLoading = false;
      },
      handleSearch() {
        this.listLoading = true;
        if (this.filters.value == '') {
          QATypeList({}).then(res => {
            this.listLoading = false;
            this.tableData = res.data;
          });
        } else {
          QATypeList({
             typeId: this.filters.value
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
        this.formModel.typrName = '';
      },
      handleEdit(r) {
        this.formTitle = "编辑";
        this.action = 'edit';
        this.formVisible = true;
        this.formModel.id = r.id;
        this.formModel.typeId = r.typeId;
        this.formModel.typrName = r.typrName;
      },
      handleDel(r) {
        console.log(r.typeId+'========'+r.id);
        this.$confirm("确认删除类别“" + r.typrName + "”吗？", '提示', {}).then(() => {
          this.listLoading = true;
          NProgress.start();
          QATypeDelete({
             Action:2,
             typeId:r.typeId,
             id:r.id
          }).then((res) => {

            this.listLoading = false;
            NProgress.done();
            if (res.result === 200) {
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
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
//              新增功能
              if (this.action === 'add') {
                 saveQAType({ ...params,
                  Action: 0,
                }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result === 200) {
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
              }
//              编辑功能
              else {
                saveQAType({ ...params,
                  Action: 1
                }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  if (res.result === 200) {
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

