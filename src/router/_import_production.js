module.exports = file => () => import('@/views/' + file + '.vue');
//这是说明，生产环境下，模块为什么找到views文件夹，使用里面的内容的。
