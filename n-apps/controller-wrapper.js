var method=require("./action-wrapper");
var filewatcher = require('filewatcher');
var watcher = filewatcher();
class ControllerWrapper{
    constructor(config,app){
        
        if(config.url===undefined){
            throw("'url' was not found");
        }
        if (config.template===undefined){
            throw ("'template' was not found");
        }
        if (config.fileName===undefined) {
            throw ( new Error("'fileName' was not found"));
        }
        if (config.app===undefined) {
            throw ( new Error("'app' object was not found"));
        }
        if (config.app.hostDir===undefined) {
            throw (new Error("'app.hostDir' object was not found"));
        }
        if (config.app.fullPath===undefined) {
            throw (new Error("'app.fullPath' object was not found"));
        }
        if (config.app.name===undefined) {
            throw (new Error("'app.name' was noy found"));
        }
        if(config.settings===undefined){
            throw(new Error('settings was not found'));
        }
        if(config.settings.app===undefined){
            throw(new Error("'settings.app' was not found"));
        }
        this.settings=config.settings;
        this.url=config.url;
        this.template=config.template;
        this.fileName=config.fileName;
        this.app={
            name:config.app.name,
            hostDir: config.app.hostDir,
            fullPath: config.app.fullPath,

        };
        this.controllersCache=config.controllersCache;
        this.controller=this.controllersCache[this.fileName];
        this.apply();
        watcher.add(this.fileName);
        var me=this;
        watcher.on('change', (file,stat)=>{
            delete require.cache[file];
            me.controller = require(file);
            console.log('File modified: %s', file);
            if (!stat) console.log('deleted');
        });
        
    }
    execMethod(methodOfActions,req,res,next){
        if (methodOfActions.privilege===undefined) {
            throw (new Error(`The privilege  of action 'get' in ${this.fileName} was not found`))
        }
        var isAllow = methodOfActions.privilege === "public";
        if (!isAllow) {
            var onAuthorize = undefined;
            if (this.app.onAuthorize === null) {
                if (this.settings.onAuthorize === null) {
                    throw (new Error(`onAuthorize was not found in ${me.app.fullPath} or in ${this.settings.workingDir}`))
                } else {
                    onAuthorize = this.settings.onAuthorize;
                }
            } else {
                onAuthorize = this.app.onAuthorize;
            }
            isAllow = onAuthorize(this, req, res,next);
        }
        if (isAllow) {
            var sender={
                url:this.url,
                app:this.app,
                settings:this.settings,
                request:req,
                response:res,
                next:next
            }
            return methodOfActions.method(sender);
        } else {
            res.send(401, 'missing authorization');

        }
    }
    apply(){
        if(this.controller.actions===undefined){
            this.controller.actions.get=(sender,req,res)=>{

            }
        }
        var me=this;
        if(this.app.hostDir){
            this.settings.app.get("/"+this.app.hostDir+"/"+ this.url, (req, res,next) => {
                me.execMethod(me.controller.actions.get,req,res,next);
                
            })
        }
        else{
            this.settings.app.get("/"+this.url, (req, res) => {
                me.execMethod(me.controller.actions.get, req, res, next);
            })
        }
       


    }

}
module.exports = ControllerWrapper
/*
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
*/