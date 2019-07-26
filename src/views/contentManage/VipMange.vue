<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" >

        <el-form-item>
          <el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
        </el-form-item>
      </el-form>

    </el-col>

    <!--列表-->
    <template v-if="(tableData===undefined)">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="faceUrl"
          label= '相片'
          width= '100'
          align= 'center'
        >
          <template scope="scope">
            <img :src="cover(scope.row.faceUrl)" width="30" height="30"/>
          </template>
        </el-table-column>
        <el-table-column
          prop='name'
          label='名字'
          width='180'
          align='center'>
        </el-table-column>
        <el-table-column
          prop ='gender'
          label='性别'
          width='100'
          align='center'
          :formatter="formatterSex"
        >
        </el-table-column>
        <el-table-column
          prop= 'phone'
          label= '电话'
          width= '200'
          align= 'center'>
        </el-table-column>
        <el-table-column
          prop="post"
          label="职务"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="greeting"
          label="问候语"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="230">
          <template scope="scope">
            <el-button @click="handleEdit(scope.row)" icon="edit" size="small">编辑</el-button>
            <el-button type="danger" size="small" icon='delete' @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template v-if="!(tableData===undefined)">
      <!--<Grid :columns="VipColumns" :rows="tableData"  v-loading="listLoading" @edit="handleEdit" @del="handleDel" :isEdit="true"-->
      <!--:isDelete="true"/>-->

      <el-table
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        style="width: 100%">
        <el-table-column
          prop="faceUrl"
          label= '相片'
          width= '100'
          align= 'center'
        >
          <template scope="scope">
            <img :src="cover(scope.row.faceUrl)" width="30" height="30"/>
          </template>
        </el-table-column>
        <el-table-column
          prop='name'
          label='名字'
          width='180'
          align='center'>
        </el-table-column>
        <el-table-column
          prop ='gender'
          label='性别'
          width='100'
          align='center'
          :formatter="formatterSex"
        >
        </el-table-column>
        <el-table-column
          prop= 'phone'
          label= '电话'
          width= '200'
          align= 'center'>
        </el-table-column>
        <el-table-column
          prop="post"
          label="职务"
          width="200"
          align="center">
        </el-table-column>
        <el-table-column
          prop="greeting"
          label="问候语"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="230">
          <template scope="scope">
            <el-button @click="handleEdit(scope.row)" icon="edit" size="small">编辑</el-button>
            <el-button type="danger" size="small" icon='delete' @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
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

    <!--新增，编辑界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false" size="tiny">
      <el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">

        <el-form-item label="VIP名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="VIP电话" prop="phone">
          <el-input v-model="editForm.phone" auto-complete="off" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="VIP职务" prop="post">
          <el-input v-model="editForm.post" auto-complete="off" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="问候语" prop="greeting">
          <el-input v-model="editForm.greeting" auto-complete="off" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="相片来源" prop="faceUrl">
          <el-input v-model="editForm.faceUrl" auto-complete="off" disabled style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <template>
            <el-radio label="1" v-model="editForm.state">有效</el-radio>
            <el-radio label="0" v-model="editForm.state">失效</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <template>
            <el-radio class="radio" v-model="editForm.gender" label="1">男</el-radio>
            <el-radio class="radio" v-model="editForm.gender" label="2">女</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="相片上传" >
          <Upload   :url="faceUrl" strRegExp=".PNG|.JPG|.JPEG|.GIF" ref="upload" @callback="setUrl" ></Upload>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel"  icon="circle-cross">取 消</el-button>
        <el-button type="primary" icon="upload2" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import NProgress from 'nprogress';
  import { getList, saveSubmit} from '../../api/table';
  import { VipColumns } from '../../dictionary/columns';
  import { resetObj,cloneObj} from '@/utils/cover'
  import Upload from "../../components/Upload/upload";
  import { getAccount,getToken } from '@/utils/auth'
  export default {
    components: {
      Upload,
    },
    data() {
      var checkContact = (rule,str, callback) => {
        let reg =  /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
        let value = str.replace(/^\s*$/g,'');
        if(value===''){
          return callback(new Error('手机号不能为空'));
        }else if(!reg.test(value)) {
          return callback(new Error('手机号码不正确'));
        }else{
          callback();
        }

      };
      return {
        account:null,
        tsession:null,
        cId:null,
        //        当前页
        currentPage: 1,
//        当前页内显示条数
        pageSize:10,
//				filters: {
//					cid: '',
//				},
        VipColumns:VipColumns,
        customs:'',
        tableData:[],
        //编辑
        editFormTtile:"新增",
        editFormVisible:false,
        editLoading:false,
        sess:getToken(),
        listLoading:false,
        btnEditText:'提交',
        editForm:{
          work:1,
          id:0,
          name:'',
          customId:'',
          gender:"1",
          phone:'',
          post:'',
          faceUrl:'',
          greeting:'',
          state:"1"
        },
        faceUrl:'/admin/UploadImg.action',
        editFormRules:{
          name:[{ required: true, message: '请输入VIP名', trigger: 'blur' }],
          phone:[{ required: true,validator: checkContact,trigger: 'blur' }],
          post:[{ required: true, message: '请输入VIP职务', trigger: 'blur' }],
          greeting:[{ required: true, message: '请输入问候语', trigger: 'blur' }],
        },

      }
    },
    methods: {
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
      //      每页显示条数发生改变
      handleSizeChange(pageSize){
        this.pageSize = pageSize;
      },
//      当前页发生改变
      handleCurrentChange(currentPage){
        this.currentPage  = currentPage;
      },
      formatterSex(r,c){
        return r.gender ===2?"女":(r.gender===1?"男":"");
      },
      cover(url){
        return "."+url;
      },
      getCustoms() {
        getList("/admin/CustomerList.action",{}).then(res => {
          if(res&&res.data){
            this.customs = res.data;
            var obj = {};
            res.data.forEach(item =>{
              obj[item.cId] = item.customerName
            });
            this.$store.dispatch('setClients',obj);
          };
        })
      },
      getManger() {
        this.listLoading = true;
        let param = {
          cId:this.cId,
        };
        getList("/admin/VipList.action",param).then(res => {
          this.listLoading =false;
          if(res.data){
            this.tableData = res.data
          }else{
            this.tableData=[];
          }
//					console.log("res.data")
//          console.log(res.data);
//					console.log("this.tableData");
//          console.log(this.tableData);
        });


      },
      handleAdd(){
        this.editFormTtile="新增";
        this.editFormVisible=true;
        this.editForm = resetObj(this.editForm);
        this.editForm.id=0;
        this.editForm.Action = 0;
        this.editForm.gender ="1";
        this.editForm.state  ="1";
        this.editForm.customId = JSON.parse(unescape(getAccount())).cId;
      },
      cancel(){
        this.editFormVisible=false;
      },
      setUrl(res){
        console.log(res);
        this.editForm.faceUrl = res.data;
      },
      editSubmit(){
        console.log("editSubmit");
        console.log(this.editForm);
        let _this = this;
        let param  = cloneObj(_this.editForm);
        _this.$refs.editForm.validate((valid) => {
          if(valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.editLoading = true;
              NProgress.start();
              _this.btnEditText = '提交中';
              saveSubmit("/admin/VipModify.action",param).then((res) => {
                _this.editLoading = false;
                NProgress.done();
                _this.btnEditText = '提 交';
                let msg='';
                if(_this.editForm.Action===0){
                  msg = "新增成功";
                }else{
                  msg = "修改成功";
                }
                console.log(res.result);
                if(res.result===200){
                  _this.getManger();
                  _this.$notify({
                    title: '成功',
                    message: msg,
                    type: 'success'
                  });
                  _this.editFormVisible = false;

                }else{
                  _this.$notify({
                    title: '失败',
                    message: res.message,
                    type: 'error'
                  });
                }

              });
            }).catch(()=>{});

          }
        });
      },
      handleEdit(r){
//			  console.log("r");
//			  console.log(r);
        this.editFormTtile="编辑";
        this.editFormVisible=true;
        this.editForm.id=r.id;
        this.editForm.name=r.name;
        this.editForm.customId = r.customerId;
        this.editForm.phone = r.phone.toString();

        this.editForm.post=r.post;
        this.editForm.faceUrl=r.faceUrl;
        this.editForm.greeting=r.greeting;
        this.editForm.Action = 1;
        this.editForm.gender = r.gender.toString();
        this.editForm.state  = r.state.toString();
      },
      handleDel(r){

        var _this = this;
        this.$confirm('确认删除吗?', '提示', {
          //type: 'warning'
        }).then(() => {
          _this.listLoading = true;
          NProgress.start();
          let para = {
            id: r.id,
          };
          saveSubmit("/admin/VipDelete.action?Action=2",para).then((res) => {
            _this.listLoading = false;
            NProgress.done();
            if(res.result=="200"){
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.getManger();
            }else{
              _this.$notify({
                title: '失败',
                message: res.message,
                type: 'error'
              });
            }
            _this.editFormVisible = false;
          });

        }).catch(() => {

        });
      }
    },
    mounted() {
      // this.getCustoms();
      this.getManger();
    }
  }
</script>

<style scoped>
  .toolbar{
    padding-top:20px;

  }
</style>
