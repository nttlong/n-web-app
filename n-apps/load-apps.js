var controllersCache={};
module.exports =function(){
    const express = require('express');
    const epApp = express();
    var Info=require("./app-process-info").Info;
    var settings=require("./settings");
    var filewatcher = require('filewatcher');
    var watcher = filewatcher();
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
            
            watcher.on('change', function (file, stat) {
                delete require.cache[file];
                controllersCache[file] = require(controllerFile);
                console.log('File modified: %s', file);
                if (!stat) console.log('deleted');
            });
            var controllerDirSubDirs=fs.readdirSync(controllerDir);
            for(var j=0;j<controllerDirSubDirs.length;j++){
                var controllerFile = path.join(controllerDir, controllerDirSubDirs[j]);
                watcher.add(controllerFile);
                controllersCache[controllerFile] = require(controllerFile);
                var config= require(controllerFile);
                var sender={
                    app:appSettings,
                    settings:settings
                }
                if(config.onGet){
                    if (appSettings.hostDir){
                        
                        epApp.get("/" + appSettings.hostDir+"/" + config.url, (req, res) => {
                            var ctrl = controllersCache[controllerFile];
                            sender.request=res;
                            sender.response=res;
                            ctrl.onGet(sender);
                        })
                    }else {
                        epApp.get("/" + config.url, (req, res) => {
                            var ctrl = controllersCache[controllerFile];
                            sender.request = res;
                            sender.response = res;
                            ctrl.onGet(sender);
                        })
                    }
                    
                }
                if (config.onPost) {
                    if (appSettings.hostDir) {
                        epApp.post("/" + appSettings.hostDir + "/" + config.url, (req, res) => {
                            var ctrl = controllersCache[controllerFile];
                            sender.request = res;
                            sender.response = res;
                            ctrl.onPost(sender);
                        })
                    } else {
                        epApp.post("/" + config.url, (req, res) => {
                            var ctrl = controllersCache[controllerFile];
                            sender.request = res;
                            sender.response = res;
                            ctrl.onPost(sender);
                        })
                    }
                }
                
                

            }
        }
            
        
    }
    
   

    console.log(settings.workingDir);
    return epApp;
}