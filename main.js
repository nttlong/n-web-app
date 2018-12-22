const fx = require("./n-apps")
fx.settings.workingDir=__dirname;
var app=fx.loadApps();
app.listen(3000,()=>{
    console.log(`http://172.0.0.1:${3000}`);
})
