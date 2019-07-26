<template>
	<div>
		<el-table :data="rows" style="width: 98%">
      <el-table-column type="index" label="列号" width="100"></el-table-column>
			<template v-for="item in columns">
				<el-table-column :prop="item.prop" :label="item.label" :width="item.width" :align="item.align" :sortable="item.sortable" :formatter="item.formatter">
				</el-table-column>
			</template>
			<el-table-column inline-template :context="_self" label="操作" :width="editWidth" align='center'>
				<span>
					<el-button v-show="isEdit" size="small" icon="edit" @click="handleEdit(row)">编辑</el-button>
					<el-button v-show="isDelete" type="warning" icon="delete" size="small" @click="handleDel(row)">删除</el-button>

          <!--<el-button v-show="isLog" type="success" size="small" @click="handleLog(row)">运行日志</el-button>-->
				</span>
			</el-table-column>
		</el-table>
		<!--<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="currentSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>-->
	</div>
</template>

<script>
	export default {
		props: {
			columns: {
				type: Array,
			},
			rows: {
				type: Array,
			},
			isEdit:{
				type:Boolean,
			},
			isDelete:{
				type:Boolean
			},
			isSpecial:{
				type:Boolean
			},
			editWidth:{
				type:Number,
				default:200
			},
//			isLog:{
//				type:Boolean,
//				default:false,
//			}
		},
		data() {
			return {
				// currentPage: 4,
				// currentSize: 20,
				// total: 281,
			}
		},
		methods: {
			handleSizeChange(val) {
				this.currentSize = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			handleEdit(r){
        this.$emit("edit",r);
			},
			handleDel(r){
         this.$emit("del",r);
			},
			handleSpecail(r){
				this.$emit("yx");
			},
			handleLog(r){
				this.$emit('log',r);
			}
		},
	}
</script>
