var controllersCache={};
var controllerInstance={}
var ControllerWrapper=require("./controller-wrapper");
module.exports =function(){
    const express = require('express');
    const epApp = express();
    var Info=require("./app-process-info").Info;
    var settings=require("./settings");
    
    var fs=require("fs");
    var path=require("path");
    var appsDir=path.sep.join(settings.workingDir,"apps");
    var dirs=fs.readdirSync(appsDir);
    for(var i=0;i<dirs.length;i++){
        var appDir = path.sep.join(appsDir, dirs[i]);
        var appSettingPath=path.sep.join(appDir,"settings.js");
        var appSettings={
            hostDir: dirs[i],
            appDir:appDir,
            staticDir:"static"
        };
        var appName=dirs[i];
        try {
            if (fs.statSync(appSettingPath).isFile()) {
                var appSets = require(appSettingPath);
                Object.keys(appSets).forEach(key=>{
                    appSettings[key]=appSets[key];
                });
            }    
        } catch (error) {
            
        }
        var AppStaticDir = path.sep.join(appDir, appSettings.staticDir);
        if (appSettings.hostDir){
            epApp.use("/" + appSettings.hostDir + '/static', express.static(AppStaticDir));    
        }
        else {
            epApp.use('/static', express.static(AppStaticDir));    
        }
        epApp.use("/" + appSettings.hostDir + '/static', express.static(AppStaticDir));
        var stat = fs.statSync(appDir);
        if (stat.isDirectory()){
            var controllerDir = path.sep.join(appDir,"controllers");
            var controllerDirSubDirs=fs.readdirSync(controllerDir);
            for(var j=0;j<controllerDirSubDirs.length;j++){
                var controllerFile = path.join(controllerDir, controllerDirSubDirs[j]);
                
                controllersCache[controllerFile] = require(controllerFile);
                var config = controllersCache[controllerFile]
                var controllerConfig={
                    fileName:controllerFile,
                    url:config.url,
                    template:appSettings.template||"templates",
                    app:{
                        hostDir:appSettings.hostDir,
                        fullPath:appSettings.appDir,
                        name:appName
                    },
                    controllersCache: controllersCache,
                    settings:{
                        app:epApp
                    }

                }
                Object.keys(settings).forEach(k=>{
                    controllerConfig.settings[k]=settings[k];
                })
                Object.keys(appSettings).forEach(k=>{
                    controllerConfig.app[k]=appSettings[k];
                })
                // var sender={
                //     app:appSettings,
                //     settings:settings
                // }
                controllerInstance[controllerFile] = new ControllerWrapper(controllerConfig,epApp);
                
                
                

            }
        }
            
        
    }
    
   

    console.log(settings.workingDir);
    return epApp;
}