const router=require("express").Router();
const axios=require("axios");


router.get("/tvl",async(req,res)=>{

try{

const r=await axios.get(
`${process.env.DEFILLAMA_API}/v2/chains`
);

res.json(r.data);

}catch(e){

res.status(500).json({
error:e.message
});

}

});


module.exports=router;
