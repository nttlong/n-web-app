var lang = require("./json-lang");

class View{
    constructor(sender,model){
        this.sender = sender;
        this.model=model;
    }
    render(){
        var nunjucks = require('nunjucks');
        var path=require("path");
        var templatePath=path.sep.join(this.sender.app.fullPath,this.sender.app.template);
        nunjucks.configure(templatePath, {
            autoescape: true,
            cache: false,
            tags: {
                variableStart: '${',
                variableEnd: '}',
            }
          
        });
        var tmp = path.sep.join(templatePath,this.sender.template);
        var server=require("./controller-model-apply")(this.sender);
        this.model.$server=server;
        this.model.$$$=(key,value)=>{
            return lang.getGlobalRes("vi",key,value);
        }
        var res = nunjucks.render(tmp, this.model);
        this.sender.response.send(res);
    }
}
module.exports=View;