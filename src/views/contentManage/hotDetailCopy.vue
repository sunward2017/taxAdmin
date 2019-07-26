<template>
  <div class="app-container">

    <el-col :span="24" class="toolbar">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-select v-model="filters.pid" placeholder="请选择热点大类" @change="changePid">
            <el-option
              v-for="item in bigTypeList"
              :key="item.id"
              :label="item.bigType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filters.bigId" placeholder="请选择热点小类">
            <el-option
              v-for="item in bigList"
              :key="item.id"
              :label="item.taxType"
              :value="item.taxType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="getHotDetailList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--表格-->
    <template>
      <Grid :columns="hotDetailListColumns" :rows="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"
            :isDelete="true" />
      <div style="float: right">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          small
          layout="total, prev, pager, next"
          :total="tableData.length">
        </el-pagination>
      </div>
    </template>

    <!--弹出框-->
    <el-dialog :title="formTitle" :visible.sync="formVisible" >
      <el-form :model="formModel" label-width="90px" :rules="formRules" ref="formRef" >
        <el-form-item label="热点大类" prop="type">
          <el-select v-model="formModel.pid" placeholder="请选择热点大类" @change="changeType" style="width:500px">
            <el-option
              v-for="item in bigTypeList"
              :key="item.id"
              :label="item.bigType"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="热点小类" >
          <el-select v-model="formModel.bigId" placeholder="请选择热点小类" style="width:500px">
            <el-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.taxType"
              :value="item.taxType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="formModel.title" style="width:500px"></el-input>
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <Tinymce ref="tinymce" :value="content"></Tinymce>
        </el-form-item>
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
  import Tinymce from '../../components/tinymce'
  import {GetHotBigType} from '../../api/robot'
  import { hotDetailListColumns } from '../../dictionary/columns'
  import { getList, saveSubmit} from '../../api/table';
  import { resetObj,cloneObj} from '@/utils/cover';
  import { getAccount,getToken } from '@/utils/auth';

  export default {
    components: {
      Grid,
      Tinymce
    },
    data() {
      return{
//        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
        account:'',
        tsession:'',
        cId:0,
        bType:'',
        pid:0,
        bigId:0,
        bigTypeList:[],
//        options:[],
        filters:{
//          ptype:"热点大类",
          pid: 1,
//          stype:"热点小类",
//          sId: 1,
          sid:null,
          bigId:'',
        },


        bigList: [],
        typeList:[],//biglist副本
        formTitle: '',
        formVisible: false,
        formModel: {
          bigId:'',
//           content:'',
          pid:1,
          title:'',
          id:0,
        },
        isSubmitting: false,
        submitBtnText: '保存',
        action: '',
        formRules: {
          pid: [{ type: 'number', required: true, message: '请选择大类', trigger: 'blur' }],
          title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
        },
        hotDetailListColumns: hotDetailListColumns,
        listLoading: false,
        tableData: [],
        content:''
      }
    },
    mounted() {
      this.getHotBigType();
      this.init();
    },
    methods: {
//      每页显示条数发生改变
      handleSizeChange(pageSize){
        this.pageSize = pageSize;
      },
//      当前页发生改变
      handleCurrentChange(currentPage){
        this.currentPage  = currentPage;
      },
//      改变左边选择栏，拿到右边选择栏
      changePid(r) {
        let pid = null;
        if(r===null){
          pid = this.filters.pid;
        }else {
          pid = r;
        }
//        console.log("changePid");
//        let pid = this.filters.pid;
//        let pId = this.filters.pid;
        this.getBigList(pid).then(res => {
//    	    console.log("热点小类");
//    	    console.log(res.data);
          if(res.data&&res.data.length>0){
            this.bigList = res.data.filter((item,index)=>{
              if(item.pid === pid){
//                   console.log("item");
//                   console.log(item);
                return item;
              }
            });
//              console.log("bigList");
//              console.log(this.bigList);
            this.bigId= 0;
//             this.filters.bigId = '';
          }else{
            this.bigList=[];
            this.bigId= 0;
//              this.filters.bigId ='';
          }
//          console.log(11);
        })
      },
      init(){
        this.account = getAccount();
        this.tsession = getToken();
        var arrCookie =this.account.split("%");
        for(let i =0;i<arrCookie.length;i++){
          var arr =arrCookie[i];
          if(arrCookie[i]==="22cId"){
            let cid = arrCookie[i+3].split("22");
            this.cId = cid[1];
          }
        }

//        拿到热点大类第一条内容和对应热点小类内容

      },
//      得到左边选择栏
      getHotBigType(){
        GetHotBigType({cId : this.cId , session : this.tsession}).then(res=>{
          this.bigTypeList = res.data;
//          console.log("this.bigTypeList");
//          console.log(this.bigTypeList);
//          this.bType = res.data[0].bigType;
          let arr = [];
          arr[0] = {};
          arr[0].id = 0;
          if (!(res.data===undefined)){arr = res.data;}
          this.filters.pid = arr[0].id;
          this.changePid(arr[0].id);
          this.changeType(arr[0].id);
//          console.log("this.filters.pid");
//          console.log(res.data[0].id);
//          this.listLoading = false;
        });
      },
//     获得热点小类 pid typeList赋值
      changeType(r){
        let pId = null;
        if(r===null){
          pId=this.formModel.pid;
        }else {
          pId = r;
        }
//        console.log("this.formModel");
//        console.log(this.formModel);
//        将formModel的type给方法getBigList获取结果,到底是type还是pid?
//        let pId =this.formModel.pid;
        this.getBigList(pId).then(res => {
//            console.log("res.data");
//            console.log(res.data);
          if(res.data&&res.data.length>0){
//                给typeList赋值，给热点小类
            this.typeList = res.data.filter((item,index)=>{
              if(item.pid === pId){
                return item;
              }
            });
//                 console.log("changeType");
//                 console.log(this.typeList);
            this.formModel.pid = 1;
          }else{
            this.typeList =[];
            this.formModel.pid =1;
          }
        })
      },
//     拿到热点小类的接口
      getBigList(id){
        let param={pid:id};
//        接口 /admin/HotBigList.action
        return  getList("/admin/HotBigList.action",param);
      },
//     拿到详情问题列表
      getHotDetailList(){
        this.listloading = true;
        let pId =this.filters.pid;
        let bigId = this.filters.bigId;
        //          拿到热点小类
        this.getBigList(pId).then((res)=>{
//          console.log("getBigList");
//          console.log(res.data);
          if(res.data&&res.data.length>0){
            let obj={};
            res.data.forEach(item =>{
              obj[item.id] = item.taxType;
            });
            this.$store.dispatch("SetHotBitTypes",obj);
          }
          if(!this.filters.bigId){
            return null
          } else {
            getList("/admin/HotDetailList.action",{pid:pId}).then(res => {
              this.listloading = false;
              console.log("getHotDetailList")
              console.log(res.data);
//              this.tableData = res.data.filter((item,index)=>{
//                if(item.pid === pId){
//                  if(item.bigId === bigId){
//                    return item;
//                  }
//                }
//              });
//              console.log("this.tableData");
//              console.log(this.tableData);
            })
          }

//            let param ={pid:this.filters.bigId}

        })
      },
//     添加
      handleAdd() {
        this.formTitle = '新增';
        this.action = 'add';
        this.formModel.type='';
        this.formModel.title ='';
        this.formModel.pid=1;
        this.content ='';
        this.formVisible = true;
      },
//     编辑
      handleEdit(r) {
        console.log("handleEdit");
        console.log("r");
        console.log(r);
        this.formTitle = "编辑";
        this.action = 'edit';
        this.content = r.content;
//        this.formModel.content=r.content;
//        克隆了一份form表单内容，取得是这一行的内容，克隆好像不可以。
//        this.formModel = cloneObj(r);
        this.formModel.pid = r.pid;
        this.formModel.bigId = r.bigId;
        this.formModel.id = r.id;
        this.formModel.title = r.title;
        console.log("formModel");
        console.log(this.formModel);
        this.formVisible = true;
      },
//     删除
      handleDel(r) {
        console.log(1+"删除");
        this.$confirm("确认删除吗？", '提示', {
        }).then(() => {
          this.listLoading = true;
          NProgress.start();
//          接口需要参数，删除
          console.log(2);
          saveSubmit("/admin/HotDetailDelete.action",{
            Action: 2,
            id: r.id
          }).then((res) => {
            console.log(3);
            this.listLoading = false;
            NProgress.done();
            if (res.result === 200) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              console.log(4);
//              更新热点详情列表
              this.getHotDetailList();
            } else {
              this.$notify({
                title: '失败',
                message: "删除失败",
                type: 'error'
              });
            }
            this.formVisible = false;
          });
        }).catch(() => {

        });
      },

//      handleSubmitForm(){},

      handleSubmitForm() {
        let params =  {};
        params.bigId = this.formModel.bigId;
//        params.id = this.formModel.id;
        params.pid = this.formModel.pid;
        params.title = this.formModel.title;
        params.content = this.$refs.tinymce.getTinymce();
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';



              if (this.action === 'add') {
//                新增需要提交什么字段？热点大类id，热点小类id？content?
                saveSubmit("/admin/HotDetailModify.action?",{ ...params,
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
//                    刷新热点详情列表
                    this.getHotDetailList();
                  } else {
                    this.$notify({
                      title: '失败',
                      message: "res.message",
                      type: 'error'
                    });
                  }
                  this.formVisible = false;
                });
              }
              else {
                params.id = this.formModel.id;
                saveSubmit("/admin/HotDetailModify.action?",{ ...params,
                  Action: 1,
                }).then((res) => {
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  console.log(res.result);
                  console.log(res.result===200);
                  console.log(res.message);
                  if (res.result === 200) {
                    this.$notify({
                      title: '成功',
                      message: '编辑成功',
                      type: 'success'
                    });
//                  刷新热点详情列表
                    console.log("编辑，拿到list");
                    this.getHotDetailList();
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

    },

  }

</script>


