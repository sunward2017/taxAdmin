import {
  formatterSex,
  formatterType,
  formatterCid,
  formatterSendDay,
  formatterSaleTime,
  formatterLoanDay,
  formatterRebackDay,
  formatterStatus,
  formatterHotBigType,
  formatterHotTaxType
} from '../utils/formatter'


export const VipColumns = [];

export const userRegisterColumns = [
  {
    prop: 'customerName',
    label: '客户名称',
    width: '130',
    align: 'center',
    sortable: 'true'
  },
  // {
  //   prop: 'cId',
  //   label: '客户ID',
  //   width: '130',
  //   align: 'center',
  //   sortable: 'true'
  // },
  {
    prop: 'phone',
    label: '电话',
    align: 'center',
    width: '130'
  }, {
    prop: 'contactName',
    label: '联系人',
    align: 'center',
    width: '100'
  }, {
    prop: 'contactPhone',
    label: '联系人电话',
    align: 'center',
    width: '140'
  }, {
    prop: 'gender',
    label: '性别',
    align: 'center',
    width: '80',
    formatter: formatterSex,
  }, {
    prop: 'qq',
    label: 'QQ号',
    align: 'center',
    width: '100'
  }, {
    prop: 'eMail',
    label: '邮箱',
    align: 'center',
    width: '150'
  },
  // {
  //   prop: 'country',
  //   label: '国籍',
  //   align: 'center',
  //   width: '100'
  // }, {
  //   prop: 'city',
  //   label: '城市',
  //   align: 'center',
  //   width: '120'
  // },
  // // {
  //   prop: 'community',
  //   label: '社区',
  //   align: 'center',
  //   width: '100'
  // },
  {
    prop: 'industry',
    align: 'center',
    label: '行业',
    width: '120'
  },
  {
    prop: 'address',
    label: '地址',
    align: 'center',
    width: '120'
  },
  // {
  //   prop: 'memo',
  //   label: '备注',
  //   align: 'center',
  //   width: ''
  // }
];

export const customColumns = [
  {
  prop: 'customerName',
  label: '客户名称',
  width: '130',
  align: 'center',
  sortable: 'true'
}, {
  prop: 'phone',
  label: '电话',
  align: 'center',
  width: '130'
}, {
  prop: 'contactName',
  label: '联系人',
  align: 'center',
  width: '100'
}, {
  prop: 'contactPhone',
  label: '联系人电话',
  align: 'center',
  width: '130'
}, {
  prop: 'gender',
  label: '性别',
  align: 'center',
  width: '80',
  formatter: formatterSex,
}, {
  prop: 'qq',
  label: 'QQ号',
  align: 'center',
  width: '100'
}, {
  prop: 'eMail',
  label: '邮箱',
  align: 'center',
  width: '150'
}, {
  prop: 'country',
  label: '国籍',
  align: 'center',
  width: '100'
}, {
  prop: 'city',
  label: '城市',
  align: 'center',
  width: '120'
}, {
  prop: 'community',
  label: '社区',
  align: 'center',
  width: '100'
}, {
  prop: 'industry',
  align: 'center',
  label: '行业',
  width: '120'
}, {
  prop: 'address',
  label: '地址',
  align: 'center',
  width: '120'
}, {
  prop: 'memo',
  label: '备注',
  align: 'center',
  width: ''
}];

export const sysUsersColumns = [{
  prop: 'type',
  label: '类型',
  align: 'center',
  width: '200',
  formatter:formatterType
}, {
  prop: 'account',
  label: '账号',
  align: 'center',
  width: ''
}]

export const robotRegisterColumns = [
{
  prop: 'robotName',
  label: '名称',
  align: 'center',
  width: '160'
},{
    prop: 'robotId',
    label: '机器人ID',
    width: '200',
    align: 'center',
  },{
  prop: 'devId',
  label: '设备ID',
  width: '160',
  align: 'center',
},{
  prop: 'address',
  label: '地址',
  width: ' ',
},{
  prop: 'phoneNumber',
  label: '联系电话',
  width: '130',
  align: 'center',
},{
  prop: 'sysVer',
  label: '系统版本',
  width: '120',
  align: 'center',
}, {
  prop: 'model',
  label: '机器人型号',
  align: 'center',
  width: '160'
},{
  prop: 'description',
  label: '机器人备注',
  width: '120',
  align: 'left',
} ];

export const robotHotVideoColumns = [
  {
    prop: 'robotName',
    label: '名称',
    align: 'center',
    width: '160'
  },{
    prop: 'robotId',
    label: '机器人ID',
    width: '300',
    align: 'center',
  },{
    prop: 'devId',
    label: '设备ID',
    width: '195',
    align: 'center',
  },{
    prop: 'address',
    label: '地址',
    width: ' 260',
    align: 'center',
  },{
    prop: 'phoneNumber',
    label: '手机号码',
    width: '125',
    align: 'center',
  },{
    prop: 'sysVer',
    label: '系统版本',
    width: '100',
    align: 'center',
  }, {
    prop: 'model',
    label: '机器人型号',
    align: 'center',
    width: '160'
  },{
    prop: 'description',
    label: '机器人备注',
    width: '270',
    align: 'left',
  } ];

export const robotRegisterColumnsForQuestions = [
  {
    prop: 'robotName',
    label: '机器人名称',
    align: 'center',
    width: '200'
  }, {
    prop: 'devId',
    label: '设备ID',
    width: '200',
    align: 'center',
  }];

export const robotRepairColumns = [{
  prop: 'robotId',
  label: '机器人ID',
  width: '200',
  align: 'center',
}, {
  prop: 'sendPerson',
  label: '送修人',
  align: 'center',
  width: '100'
}, {
  prop: 'sendPhone',
  label: '送修人电话',
  align: 'center',
  width: '150'
},{
  prop: 'sendDay',
  label: '送修日期',
  align: 'center',
  width: '150',
  formatter:formatterSendDay
}, {
  prop: 'problemDescribe',
  label: '问题描述',
  align: 'center',
  width: ''
},{
  prop: 'recvName',
  label: '接收方',
  align: 'center',
  width: '150'
},{
  prop: 'estimateDays',
  label: '预估天数',
  align: 'center',
  width: '150'
},{
  prop: 'handlePerson',
  label: '处理人',
  align: 'center',
  width: '150'
},{
  prop: 'memo',
  label: '备注',
  align: 'center',
  width: '200'
},];

export const robotSaleColumns = [{
  prop: 'robotId',
  label: '机器人ID',
  width: '200',
  align: 'center',
},{
  prop: 'cId',
  label: '客户ID',
  width: '200',
  align: 'center',
}, {
  prop: 'cName',
  label: '名称',
  align: 'center',
  width: '200'
}, {
  prop: 'phone',
  label: '电话',
  align: 'center',
  width: ''
}, {
  prop: 'saleTime',
  label: '销售时间',
  align: 'center',
  width: '',
  formatter:formatterSaleTime
},{
  prop: 'price',
  label: '价格',
  align: 'center',
  width: ''
},{
  prop: 'memo',
  label: '备注',
  align: 'center',
  width: ''
},{
  prop: 'operateName',
  label: '操作人',
  align: 'center',
  width: ''
},];

export const robotLoanColumns = [{
  prop: 'robotId',
  label: '机器人ID',
  width: '200',
  align: 'center',
},  {
  prop: 'loanPerson',
  label: '借调人',
  align: 'center',
  width: ''
}, {
  prop: 'loanPhone',
  label: '借调人电话',
  align: 'center',
  width: ''
},{
  prop: 'loanDay',
  label: '借调日期',
  align: 'center',
  width: '',
  formatter:formatterLoanDay
},{
  prop: 'rebackDay',
  label: '归还日期',
  align: 'center',
  width: '',
  formatter:formatterRebackDay
},{
  prop: 'memo',
  label: '备注',
  align: 'center',
  width: ''
}];

export const QATypeListColumns = [{
  prop: 'typeId',
  label: '类别ID',
  width: '',
  align: 'center',
},{
  prop: 'typrName',
  label: '类别名',
  align: 'center',
  width: ''
}];

export const videoListColumns = [
 {
  prop: 'content',
  label: '视频描述',
  align: 'center',
  width: ''
}, {
  prop: 'fileSzie',
  label: '视频大小',
  align: 'center',
  width: '100'
},{
  prop: 'md5',
  label: 'MD5',
  align: 'center',
  width: '300',
},{
  prop: 'videoUrl',
  label: '视频地址',
  align: 'center',
  width: '300',
}];


export const mapListColumns = [
  {
  prop: 'regionName',
  label: '地图区域',
  align: 'center',
  width: ''
},{
  prop: 'mapUrl',
  label: '地图地址',
  align: 'center',
  width: '',
},{
  prop: 'cTime',
  label: '创建时间',
  align: 'center',
  width: '',
}];

export const pointListColumns = [
{
  prop: 'account',
  label: '用户',
  width: '300',
  align: 'center',
  sortable: 'true',
}, {
  prop: 'pointName',
  label: '打点名称',
  align: 'center',
  width: ''
},{
  prop: 'pointDescribe',
  label: '打点描述',
  align: 'center',
  width: '',
}];

export const versionColumns = [
{
  prop: 'packageName',
  label: '包名',
  width: '100',
  align: 'center',
  sortable: 'true',
},{
  prop: 'versionName',
  label: '版本名称',
  width: '200',
  align: 'center',
},  {
  prop: 'versionCode',
  label: '版本号',
  align: 'center',
  width: '200'
}, {
  prop: 'versionDescription',
  label: '版本描述',
  align: 'center',
  width: ''
},{
  prop: 'status',
  label: '状态',
  align: 'center',
  width: '80',
  formatter:formatterStatus
}];

export const hotBigList = [{
  prop: 'id',
  label: 'ID',
  align: 'center',
  width: ''
},{
  prop: 'bigType',
  label: '热点大类',
  width: '',
  align: 'center',
  // formatter:formatterHotBigType
}];

export const hotBigListForColumns =[{
  prop: 'id',
  label: 'ID',
  align: 'center',
  width: ''
},{
  prop: 'bigType',
  label: '热点大类',
  width: '',
  align: 'center',
}];

export const hotBigListColumns = [
//   {
//   prop: 'id',
//   label: 'ID',
//   align: 'center',
//   width: ''
// },
  {
  prop: 'bigType',
  label: '热点大类',
  width: '',
  align: 'center',
  // formatter:formatterHotBigType
}];

export const hotMiddleListColumns = [
//   {
//   prop: 'id',
//   label: 'ID',
//   align:'center',
//   width:''
// },
  {
  prop: 'taxType',
  label: '税务类型',
  align:'center',
  width:''
}, {
  prop: 'pid',
  label: '热点大类ID',
  align:'center',
  width:''
}];

export const hotDetailListColumns = [{
  prop: 'pid',
  label: '热点类型',
  align: 'center',
  width: '280',
  // formatter:formatterHotTaxType
},{
  prop: 'title',
  label: '标题',
  width: '',
  align: 'center',
}];


