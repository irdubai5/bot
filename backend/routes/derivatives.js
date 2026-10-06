const router=require("express").Router();
const axios=require("axios");


router.get("/perpetual",async(req,res)=>{

try{

const symbols=[
"BTCUSDT",
"ETHUSDT",
"BNBUSDT",
"SOLUSDT",
"XRPUSDT"
];


let output=[];


for(const symbol of symbols){

const [
ticker,
funding,
oi,
ratio
]=await Promise.all([

axios.get(
`${process.env.BINANCE_FUTURES}/fapi/v1/ticker/24hr?symbol=${symbol}`
),

axios.get(
`${process.env.BINANCE_FUTURES}/fapi/v1/premiumIndex?symbol=${symbol}`
),

axios.get(
`${process.env.BINANCE_FUTURES}/fapi/v1/openInterest?symbol=${symbol}`
),

axios.get(
`${process.env.BINANCE_FUTURES}/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=5m&limit=1`
)

]);


output.push({

symbol,

price:Number(ticker.data.lastPrice),

change24h:Number(ticker.data.priceChangePercent),

fundingRate:Number(funding.data.lastFundingRate),

openInterest:Number(oi.data.openInterest),

longShort:
ratio.data[0]?.longShortRatio || null

});

}


res.json(output);


}catch(e){

res.status(500).json({
error:e.message
});

}


});


module.exports=router;
