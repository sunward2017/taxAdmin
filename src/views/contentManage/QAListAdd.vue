<template>
  <section>

    <el-row :gutter="0" class="toolbar">
      <el-col :span="24">
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="typeId" placeholder="请选择类别" style="width:100%" @change="getInfoTree" >
              <el-option
                v-for="item in QAtypes"
                :key="item.typrName"
                :label="item.typrName"
                :value="item.typeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText"
              style="width:200px">
            </el-input>
          </el-form-item>
          <!--<el-form-item>-->
            <!--<el-button :plain="true" @click="open">注意事项</el-button>-->
          <!--</el-form-item>-->
          <!--&nbsp;&nbsp;<el-form-item>&nbsp;-->
          <!--<el-button type="primary" @click="handleAdd" icon="plus">新增问题库</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </el-col>
    </el-row>

    <el-row class="tree1">
      <el-tree
        style="width:95%"
        :loading="treeLoading"
        class="filter-tree"
        accordion
        :data="data2"
        node-key="id"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="tree2"
        :render-content="renderContent"
        @node-click="getCurrentNode"
      >
      </el-tree>
    </el-row>

    <!--添加，编辑窗口-->
    <el-dialog :title="formTitle" :visible.sync="formVisible">
      <el-form :model="formModel" label-width="90px" :rules="formRules" ref="formRef">
        <template v-if="this.formTitle==='添加'">
          <el-form-item label="上级">
            <el-input v-model="formModel.Pcontent" :disabled="true"  type="textarea" :rows="8" style="width: 80%"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="内容" prop="content">
          <el-input v-model="formModel.content" type="textarea" :rows="8" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="表情" prop="emoticon">
          <el-select   placeholder="请选择" v-model="formModel.emoticon">
            <el-option
              v-for="item in Emos"
              :key="item.id"
              :label="item.emoticon"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="formModel.state" >
            <el-radio :label=1>有效</el-radio>
            <el-radio :label=0>无效</el-radio>
          </el-radio-group>
          <span style="color: red">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置无效后该条问答及其以下的问答一并删除</span>
        </el-form-item>
        <!--<el-form-item>-->
          <!--设置-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="isSubmitting">{{submitBtnText}}</el-button>
      </div>
    </el-dialog>

  </section>
</template>
<script>
  import NProgress from 'nprogress'
  import { QAInfoTree, QATypeList, QAInfoModify,QAInfoDelete} from '../../api/QA'
  import { getToken,getAccount } from '../../utils/auth'
  import {GetRobotEmoticon} from '../../api/robot'
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    components: {ElFormItem},
    watch: {
      filterText(val) {
//        console.log("watch");
        this.$refs.tree2.filter(val);
      }
    },

    methods: {
//      open() {
//
//        this.$message({
//          message: '请先双击该行，再点击添加或编辑按钮',
//          type: 'success',
//          showClose: true,
//        });
//      },
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
      filterNode(value, data) {
//        console.log("filterNode");
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      append(store, data) {
        console.log("append，数据为空");
        this.formTitle="添加"
//        this.formModel.id = 0;
        this.formModel.pid = data.id;
//        console.log("pid");
//        console.log(data.id);
        this.formModel.Action = 0;
        this.formModel.Pcontent = data.content?data.content:data.title;
        this.formModel.content ="";
        this.formModel.state=1;
//        this.formModel.emoticon=1;
        this.formVisible = true;
      },
      edit(store,data){
        if(store.data===[]){
          console.log("edit，数据为空");
          NProgress.start();
          this.getInfoTree();
          this.getEmoticonList();
        }
        else {
          if(data.pid===undefined){
            alert("这是根节点，不可以编辑");
          }
          else{
            console.log("edit");
            console.log(store);
            console.log(data);
            NProgress.done();
//      console.log("edit");
            this.formTitle = "编辑";
            this.formModel.id = data.id;
            this.formModel.pid = data.pid;
            this.formModel.Action = 1;
            this.formModel.content = data.content?data.content:data.title;
            this.formModel.Pcontent = store.currentNode.data.Pcontent;

            this.formModel.emoticon = data.emoticon;
            this.formModel.state = 1;
//          this.formModel.emoticon = 1;
            this.formVisible = true;
          }
        }
      },
      remove(store, data) {
//        console.log("data");
//        console.log(data);
        if(data.pid===undefined){
          alert("这是根节点，不可以删除");
        }
        else{
          this.$confirm("确认删除吗？", '提示', {
          }).then((res) => {
            NProgress.start();
            QAInfoDelete({id:data.id,Action:2,pid:data.pid}).then((res)=>{
              this.listLoading = false;
              NProgress.done();
              if (res.result === 200) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                });
                this.getInfoTree();
              } else {
                this.$notify({
                  title: '失败',
                  message: res.message,
                  type: 'error'
                });
              }
              this.formVisible = false;
            })
          })}
      },
      getCurrentNode( node, data, store){
       //console.log("拿到当前节点");
        //console.log(node);
       //console.log(data);
       // console.log(store);
      },

//      渲染按钮  添加 编辑 删除
      renderContent(h, { node, data, store }) {
//        this.formModel.emoticon = this.emoticon;
        return (
          <span>
          <span>
          <span>{node.label}</span>
        </span>
        <span style="float: right; margin-right: 20px">
          <el-button size="mini" on-click={ () => this.append(store, data) }>添加</el-button>

        <el-button size="mini" on-click={ () => this.edit(store, data) }>编辑</el-button>
        <el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>

        </span>
        </span>

      );
      },

//      拿到大类的方法getQAtypes
      getQAtypes(){
        QATypeList({}).then(res => {
          this.QAtypes = res.data;
          this.typeId = res.data[0].typeId;
//          console.log("this.QAtypes");
//          console.log(this.QAtypes);
//          console.log("this.typeId");
//          console.log(this.typeId);
          //this.getInfoTree();
        });
      },
//      拿到树数据的方法getInfoTree  接口QATree({typeId:this.typeId})
      getInfoTree(){
        this.treeLoading = true;
        QAInfoTree({typeId:this.typeId}).then((res)=>{
//          console.log("typeId");
//          console.log(this.typeId);
          this.treeLoading = false;
          this.data2 = res.data;
          console.log("getInfoTree");
          console.log(this.data2);
        })
      },
      handleSubmitForm(){
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              NProgress.start();
              this.isSubmitting = true;
              this.submitBtnText = '提交中';
              if(this.formModel.Action === 0){
                QAInfoModify({pid:this.formModel.pid, content:this.formModel.content, state:this.formModel.state, emoticon:this.formModel.emoticon, Action:this.formModel.Action, session:this.session, customerId:this.cId, account:this.account, typeId:this.typeId  }).then((res)=>{
                  this.isSubmitting = false;
                  NProgress.done();
                  this.submitBtnText = '提交';
                  this.formVisible = false;
                  if(res.result ===200){
                    let msg = "添加成功";
                    this.$notify({
                      title: '成功',
                      message: msg,
                      type: 'success'
                    });
                    this.getInfoTree();
                  }else{
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
//                  console.log("新增");
//                  console.log(this.formModel);
                });

              }
              else{
                QAInfoModify({id:this.formModel.id, pid:this.formModel.pid, content:this.formModel.content, state:this.formModel.state, emoticon:this.formModel.emoticon, Action:this.formModel.Action, typeId:this.typeId  }).then((res)=>{
                  this.isSubmitting = false;
//                  NProgress.done();
                  this.submitBtnText = '提交';
                  this.formVisible = false;
                  if(res.result ===200){
                    let msg = "修改成功";
                    this.$notify({
                      title: '成功',
                      message: msg,
                      type: 'success'
                    });
                    NProgress.done();
                    this.getInfoTree();
                  }else{
                    this.$notify({
                      title: '失败',
                      message: res.message,
                      type: 'error'
                    });
                  }
//                  console.log("编辑");
//                  console.log(this.formModel);
                });

              }
              })
          }
        });
        console.log("表情包");
        console.log(this.formModel.emoticon);
      },
      getEmoticonList(){
        GetRobotEmoticon({}).then(res=>{
          this.Emos = res.data;
          console.log("getEmoticonList---表情包");
          console.log(res.data);
        });
        this.emoticonUrl =  this.Emos.map((item)=>{
          return item.emoticonUrl;
        });
      },
    },
    mounted(){
      this.getEmoticonList();
      this.getQAtypes();
      this.init();

    },
    data() {
      return {
        i:0,
        account:'',
        session:'',
        cId:'',
        filterText: '',
        data2: [],
        defaultProps: {
          children: 'children',
          label: function(data,node){
            let label = data.title?data.title:data.content
            return label
          }
        },
//        emoticon:null,
        formModel:{
          pid:'',
          content:'',
          Action:0,
          id:0,
          state:1,
          emoticon:1
        },
        QAtypes:[],
        Emos: [],
        typeId:'',
        formTitle:'添加',
        treeLoading:false,
        formVisible:false,
        isSubmitting:false,
        submitBtnText:'提交',
        formRules:{
          content:[{ required: true, message: '请输入内容', trigger: 'blur' }],
        }
      };
    }
  };
</script>
<style scoped>
  .toolbar{
    margin: 10px 0;
  }
  .tree1 .toolbar {
    /*display:inline-block;*/
    /*text-align: justify;*/
    /*width:550px;*/
  }

</style>

