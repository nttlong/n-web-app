module.exports =function(){
    var settings=require("./settings");
    var fs=require("fs");
    var path=require("path");
    var appsDir=path.sep.join(settings.workingDir,"apps");
    var dirs=fs.readdirSync(appsDir);
    for(var i=0;i<dirs.length;i++){
        var appDir = path.sep.join(appsDir, dirs[i]);
        var stat = fs.statSync(appDir);
        if (stat.isDirectory())
            require(appDir);
        
    }

    console.log(settings.workingDir);
}