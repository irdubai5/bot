const router=require("express").Router();


router.post("/analyze",(req,res)=>{

const {address}=req.body;


if(!address)
return res.status(400).json({
error:"wallet required"
});


res.json({

address,

balance:null,

transactions:[],

pnl:null,

risk:"pending",

score:null

});


});


module.exports=router;
