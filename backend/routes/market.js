const router=require("express").Router();
const axios=require("axios");


router.get("/bybit",async(req,res)=>{

const r=await axios.get(
"https://api.bybit.com/v5/market/tickers?category=spot"
);

res.json(r.data);

});


router.get("/okx",async(req,res)=>{

const r=await axios.get(
"https://www.okx.com/api/v5/market/tickers?instType=SPOT"
);

res.json(r.data);

});


module.exports=router;
