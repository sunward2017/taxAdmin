module.exports = {
  proxyList: {
        '/admin': {
            // 测试环境
            //   target: 'http://192.168.30.56:8091' ,
             // target:'http://192.168.10.211:8092',
              target: 'http://fw.woosiyuan.com',  // 接口域名
            // target:'http://120.55.240.188:8050',    //upload测试版
          // target:'server.woosiyuan.top:9088',        //服务端
          // target:'http://120.55.240.188:8060 ',    //阿里云服务器
            changeOrigin: true,  //是否跨域
            pathRewrite: {
                '^/admin': '/admin'   //需要rewrite重写的,
            }
        },
        '/upload': {
            // 测试环境
          // target: 'http://192.168.30.56:8091' ,
          // target:'http://192.168.10.211:8092 ',
          target: 'http://fw.woosiyuan.com',
            // target: 'http://192.168.10.246:8090',  // 接口域名
            // target:'http://120.55.240.188:8050',
          // target:'http://120.55.240.188:8060 ',
            changeOrigin: true,  //是否跨域
            pathRewrite: {
                '^/upload': '/upload'   //需要rewrite重写的,
            }
        }
  }
}
