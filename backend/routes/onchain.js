const router=require("express").Router();


router.get("/status",(req,res)=>{

res.json({

activeAddresses:"pending indexer",
whales:"pending monitor",
exchangeFlow:"pending labels"

});

});


module.exports=router;
