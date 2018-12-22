var apps=require("./../../../n-apps")
module.exports={
    url:"login",
    template:"login.html",
    onGet:(sender)=>{

        var x=1;
        sender.response.send("test")
    }
}