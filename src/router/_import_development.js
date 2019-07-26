module.exports = file => require('@/views/' + file + '.vue').default;
//这是说明，开发环境下，模块为什么找到views文件夹，使用里面的内容的。
