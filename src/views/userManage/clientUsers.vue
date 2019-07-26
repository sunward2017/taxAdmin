 <template>
	<section>

		<!--工具条-->
		<el-col :span="24" class="toolbar" label-width="90px">
      <!--&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-form :inline="true" :model="filters">-->
      <el-form :inline="true" >
        <el-form-item>
					<el-button type="primary" @click="handleAdd" icon="plus">新增</el-button>
				</el-form-item>

      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="handleEdit" icon="edit">编辑</el-button>-->
      <!--</el-form-item>-->

      <!--<el-form-item>-->
        <!--<el-button type="primary" @click="handleDel" icon="minus">删除</el-button>-->
      <!--</el-form-item>-->

      </el-form>

		</el-col>
		<!--列表-->
		<template >
      <div style="float: left; width:20%; margin-right: 3%; ">
      <el-tree :data="treeData"
               :loading="treeLoading"
               accordion
               node-key="id"
               :props="defaultProps"
               style="background-color: #eef1f6"
               @node-click="handleClick"
               :render-content="renderContent"
      >
        </el-tree>
      </div>
		</template>

    <!--用户信息-->
    <div style="float: left; border:1px solid #c0cad7;margin-left:5%; padding: 30px; width:60%; background-color: #eef1f6" >
      <template v-if="clientDetail!=[]">
        <template v-for="item in clientDetail">

          <p>登录名：&nbsp;&nbsp;&nbsp; {{item.account}}</p>
          <p>用户UID：&nbsp;&nbsp;&nbsp;{{item.uid}}</p>
          <p>用户性别：&nbsp;&nbsp;&nbsp;{{item.gender===1?'男':(item.gender===0?'女':'')}}</p>
          <p>用户电话：&nbsp;&nbsp;&nbsp;{{item.phone}}</p>
          <p>用户QQ：&nbsp;&nbsp;&nbsp;{{item.qq}}</p>
          <p>用户地址：&nbsp;&nbsp;&nbsp;{{item.address}}</p>
          <p>用户ID：&nbsp;&nbsp;&nbsp;{{item.cId}}</p>
          <p>用户城市：&nbsp;&nbsp;&nbsp;{{item.city}}</p>
          <p>用户国家：&nbsp;&nbsp;&nbsp;{{item.country}}</p>
          <p>用户类型：&nbsp;&nbsp;&nbsp;{{item.type}}</p>
          <p>用户备注：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{item.memo}}</p>
          <p>用户密码：&nbsp;&nbsp;&nbsp;&nbsp;{{item.password}}</p>

        </template>
      </template>
    </div>

	    <!--新增，编辑界面-->
		<el-dialog :title="editFormTitle" :visible.sync="editFormVisible" :close-on-click-modal="false" size="tiny">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm" >
        <template v-if="this.action==='add'||this.action==='edit'">
			    <el-form-item label="用户名" prop="account">
			    	<el-input v-model="editForm.account" auto-complete="off" style="width: 67%"></el-input>
			    </el-form-item>
			     <el-form-item label="密码 " prop="password">
			    	<el-input type="password" v-model="editForm.password" auto-complete="off" style="width: 67%"></el-input>
			    </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="editForm.phone" auto-complete="off" style="width: 67%"></el-input>
          </el-form-item>
          <el-form-item label="性别 " prop="gender">
            <!--<el-input  v-model="editForm.gender" auto-complete="off" placeholder="输入1代表男，输入0代表女" style="width: 67%"></el-input>-->
            <template>
              <el-radio v-model="editForm.gender" label="1">男</el-radio>
              <el-radio v-model="editForm.gender" label="0">女</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="联系地址 " prop="address">
            <el-input  v-model="editForm.address" auto-complete="off" style="width: 67%"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input  v-model="editForm.city" auto-complete="off" style="width: 67%"></el-input>
          </el-form-item>
          <el-form-item label="国家 " prop="country">
            <el-input  v-model="editForm.country" auto-complete="off" style="width: 67%"></el-input>
          </el-form-item>
          <el-form-item label="类型 " prop="type">
            <!--<el-input  v-model="editForm.model" auto-complete="off" style="width: 67%" :disabled=true></el-input>-->
            <template>
            <el-radio v-model="editForm.type" label="1">管理员</el-radio>
            <el-radio v-model="editForm.type" label="2">操作员</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="QQ " prop="qq">
            <el-input  v-model="editForm.qq" auto-complete="off" style="width: 67%"></el-input>
          </el-form-item>
          <el-form-item label="备注 " prop="memo">
            <el-input  v-model="editForm.memo" auto-complete="off" style="width: 67%" type="textarea"
                       :rows="2"></el-input>
          </el-form-item>
        </template>

        <template v-if="this.action==='delete'">
        <el-form-item label="UID " prop="uid">
          <el-input v-model="editForm.uid" auto-complete="off"></el-input>
        </el-form-item>
        </template>
			</el-form>

			<div slot="footer" class="dialog-footer"  >
				<el-button  @click="editFormVisible = false"  icon="circle-cross">取 消</el-button>
				<el-button type="primary" icon="upload2" @click="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
      </div>
		</el-dialog>


    <!--删除界面-->
<!--<el-dialog :title="deleteFormTitle" :visible.sync="deleteFormVisible" :close-on-click-modal="false" size="tiny"  >-->
<!--<el-form :model="deleteForm" label-width="90px"  ref="deleteForm"  :rules="deleteFormRules">-->
  <!--<el-form-item label="UID " prop="uid">-->
    <!--<el-input v-model="deleteForm.uid" auto-complete="off"  placeholder="请输入客户UID"></el-input>-->
  <!--</el-form-item>-->

 <!--</el-form>-->
  <!--<div slot="footer" class="dialog-footer"  >-->
  <!--<el-button  @click="deleteFormVisible = false"  icon="circle-cross">取 消</el-button>-->
  <!--<el-button type="primary" icon="upload2" @click="delSubmit" >{{btnEditText}}</el-button>-->
  <!--</div>-->
<!--</el-dialog>-->



	</section>
</template>

<script>
    import NProgress from 'nprogress'
    import {GetCustomerUserTree, AdminSelectAll, CustomerList} from '../../api/clientUser';
	import { getList, saveSubmit} from '../../api/table';
	import { sysUsersColumns } from '../../dictionary/columns';
    import { resetObj,cloneObj} from '@/utils/cover'
 	import { getAccount, getToken } from '@/utils/auth'
    import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component.vue";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio.vue";

	export default {

    components: {
      ElRadio,
      ElFormItem,
      ElDialog},
    data() {
			return {
        treeLoading:false,
        account:'',
        tsession:'',
        cId:'',
//				filters: {
//					cid: '',
//					type:'2'
//				},
//				types: [{
//		          value: "1",
//		          label: '超级管理员'
//		        }, {
//		          value: "2",
//		          label: '普通管理员',
//		          // disabled: true
//		        }],
        treeData:[],
        clientDetail:[],

        defaultProps: {
          children: 'children',
          label: function(data,node){
            let label = data.name?data.name:data.id;
            return label
          }
        },

				sysUsersColumns:sysUsersColumns,
				customs:'',
				tableData:[],
        customerList:[],
				isShow:false,
				action:'',
        editFormTitle:"新增",
				editFormVisible:false,
				editLoading:false,
				listLoading:false,
				btnEditText:'提交',
				editForm:{
          loginName:'',
					cId:'',
          account:'',
          password:'',
          uid:'',
          gender:null,
          qq:null,
          phone:null,
          address:'',
          city:'',
          country:'',
          type:"1",
          memo:'',
				},
				editFormRules:{
//                    cId: [{ required: true, message: '请选择客户Id', trigger: 'blur' }],
//                    type: [{ required: true, message: '请选择权限', trigger: 'blur' }],
                    account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				},
			}
		},
		methods: {
      renderContent(h, { node, data, store }) {
        return (
          <span>
          <span>
          <span>{node.label}</span>
        </span>
        <span style="float: right; padding-right: 2%">
          <el-button size="mini" on-click={ () => this.delete(store, data) }>删除</el-button>
        <el-button size="mini" on-click={ () => this.edit(store, data) }>编辑</el-button>
        </span>
        </span>

      );

      },
      edit(store,data){
        console.log("edit编辑方法");
//        console.log("data");
//        console.log(data);
//        console.log("store");
//        console.log(store);
        if(data.model==="A"){
          alert("这是根节点，不可以编辑")
        }
        else{
          this.editFormTitle="编辑";
          this.editFormVisible=true;
          this.action = 'edit';
//          if(this.clientDetail.length===0){
            AdminSelectAll({uid:data.id, model:data.model, session:this.tsession, cId:this.cId, account:this.account}).then((res)=> {
              let a = res.data;
              this.editForm = Object.assign(a[0]);
              if (this.editForm.gender!=null){
                let gender  =  this.editForm.gender;
                this.editForm.gender = gender.toString();
              }
              if(this.editForm.type!=null){
                let type  = this.editForm.type;
                this.editForm.type = type.toString();
              }
            });
//            }
        }
      },
      delete(store,data) {
        console.log("data");
        console.log(data);
        console.log("store");
        console.log(store);
        if(data.model==="A"){
          alert("这是根节点，不可以删除")
        }else{
          var _this = this;
          this.$confirm('确认删除用户：' + data.name + ' 吗?', '提示', {
          }).then(() => {
            let para = {
              uid:data.id,
            }
            saveSubmit("/admin/AdminDel.action?Action=2", para).then((res) => {
              if (res.result === 200) {
                _this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                });
                _this.getTableData();
                _this.clientDetail=[];
              } else {
                _this.$notify({
                  title: '失败',
                  message: res.message,
                  type: 'error'
                });
              }
              _this.deleteFormVisible = false;
              _this.editForm.uid = undefined;
            });
          });
        }

      },
      init(){
        this.account = getAccount();
        this.session = getToken();
        var arrCookie =this.account.split("%");
        for(let i =0;i<arrCookie.length;i++){
          var arr =arrCookie[i];
          if(arrCookie[i]==="22cId"){
            let cid = arrCookie[i+3].split("22");
            this.cId = cid[1];
          }
        }

      },
      handleClick(data,node,object){
//        console.log("获得当前行的数据");
//        console.log("handleClick");
//        console.log(data);
        if(data.model!=="A"){
          AdminSelectAll({uid:data.id, model:data.model, session:this.tsession, cId:this.cId, account:this.account}).then((res)=>{
//            console.log("用户信息");
//            console.log(res.data);
            this.clientDetail = res.data;
            console.log("this.clientDetail");
            console.log(this.clientDetail);
          });
        }else{
          this.clientDetail = [];
        }
      },

      getTableData(){
        this.treeLoading = true;
        GetCustomerUserTree({}).then((res)=>{
          this.treeLoading = false;
          this.treeData = res.data;
          console.log("this.treeData");
          console.log(this.treeData);
        });
      },
      editSubmit(){
        let _this = this;
        if(this.action==='add'){_this.editForm.loginName = _this.editForm.account;}
//        _this.editForm.account = '';
        let param  = cloneObj(_this.editForm);

        _this.$refs.editForm.validate((valid) => {
          if(valid) {
            _this.$confirm('确认提交吗？', '提示', {}).then(() => {
              _this.editLoading = true;
              NProgress.start();
              _this.btnEditText = '提交中';
              if(_this.action==="add"){
                saveSubmit("/admin/AdminAdd.action?Action=0",param).then((res) => {
                  _this.editLoading = false;
                  NProgress.done();
                  _this.btnEditText = '提 交';
                  if(res.result===200){
                    _this.$notify({
                      title: '成功',
                      message: '新增成功',
                      type: 'success'
                    });
                    _this.editFormVisible = false;
                    _this.getTableData();
                    _this.clientDetail=[];
                  }else{
                    _this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }

                });
              } else {
                saveSubmit("/admin/AdminModify.action?Action=1",param).then((res) => {
                  _this.editLoading = false;
                  NProgress.done();
                  _this.btnEditText = '提 交';
                  if(res.result===200){
                    _this.$notify({
                      title: '成功',
                      message: '编辑成功',
                      type: 'success'
                    });
                    _this.getTableData();
                    _this.clientDetail=[];
                  }else{
                    _this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
                  _this.editFormVisible = false;
                });

              }

            }).catch(()=>{});

          }
        });
      },

      handleAdd(){
        this.editFormTitle="新增";
        this.action = "add";
        this.editFormVisible=true;
        this.editForm = resetObj(this.editForm);
        this.editForm.type="2";
        this.editForm.cId=JSON.parse(unescape(getAccount())).cId;
      },
      handleDel(){
        this.action = 'delete';
        this.deleteFormVisible = true;
      },
      delSubmit() {
        var _this = this;
        this.$confirm('确认删除用户：' + this.deleteForm.account + ' 吗?', '提示', {
        }).then(() => {
          _this.listLoading = true;
          NProgress.start();
          let para = {
            uid: this.deleteForm.uid,
          };
          saveSubmit("/admin/AdminDel.action?Action=2", para).then((res) => {
            _this.listLoading = false;
            NProgress.done();
            if (res.result === 200) {
              _this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              });
              _this.getTableData();
              _this.clientDetail=[];
            } else {
              _this.$notify({
                title: '失败',
                message: res.message,
                type: 'error'
              });
            }
            _this.deleteFormVisible = false;
            _this.editForm.uid = undefined;
          });

        }).catch(() => {});

      },

	},
    mounted(){
      this.getTableData();
      this.init();
    },
  }
</script>

<style scoped>
  .toolbar{
  	 padding-top:20px;
  }

</style>
