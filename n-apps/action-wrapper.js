var __privileges__=";public;view;insert;update;delete;print;export;import;copyy;custome;"
class InvalidPrivileges extends Error {
    constructor(message){
        super(`"${message}" is invalid value, the value must be in ${__privileges__}`);

    }
}

class actionWrapper {
    constructor(privilege,fn){
        if (__privileges__.indexOf(";"+privilege+";")==-1){
            throw (new InvalidPrivileges(privilege))
        }
        this.privilege=privilege;
        this.method=fn;
    }
}

module.exports=(privilge,fn)=>{
    return new actionWrapper(privilge,fn);
}