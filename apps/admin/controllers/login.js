var apps=require("./../../../n-apps")
module.exports={
    url:"login",
    template:"login.html",
    actions:{
        post:apps.action(
            "public",
            (sender)=>{
                return new apps.view(sender, {
                    test:"XXXX"
                });
            }
        ),
        get:apps.action(
            "public",
            (sender) => {
                return new apps.view(sender,{
                    test:"YYYYYYYYY"
                });
            }
        )
    },
    ajax:{

    }
    
}