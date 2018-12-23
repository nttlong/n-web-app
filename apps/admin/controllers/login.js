var apps=require("./../../../n-apps")
module.exports={
    url:"login",
    template:"login.html",
    actions:{
        post:apps.action(
            "public",
            ()=>{

            }
        ),
        get:apps.action(
            "public",
            (sender) => {
                sender.response.send("Hello this is my app")

            }
        )
    },
    ajax:{

    }
    
}