const {createProxyMiddleware}=require('http-proxy-middleware');

module.exports=function(app){
    app.use(
        '/api',
        createProxyMiddleware({
            target:'http//http://localhost:8080',
            changeOrigin:true,
        })
    );
};