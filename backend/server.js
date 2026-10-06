require('dns').setDefaultResultOrder('ipv4first');
require("dotenv").config();

const express=require("express");
const cors=require("cors");
const helmet=require("helmet");
const compression=require("compression");
const morgan=require("morgan");

const derivatives=require("./routes/derivatives");
const market=require("./routes/market");
const defi=require("./routes/defi");
const onchain=require("./routes/onchain");
const wallet=require("./routes/wallet");

const app=express();

const PORT=Number(process.env.PORT)||3000;
const HOST=process.env.HOST||"0.0.0.0";

const allowedOrigins=(process.env.CORS_ORIGINS||"").split(",").map(v=>v.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS origin denied"));
  } : true
}));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));

app.get("/api/health",(req,res)=>{
 res.json({
  status:"online",
  time:new Date()
 });
});

app.use("/api/derivatives",derivatives);
app.use("/api/market",market);
app.use("/api/defi",defi);
app.use("/api/onchain",onchain);
app.use("/api/wallet",wallet);


app.use((err,req,res,next)=>{
 console.error("[BackendError]",err);
 if(res.headersSent) return next(err);
 res.status(500).json({error:"Internal server error"});
});

app.listen(PORT,HOST,()=>{
 console.log(`AI Intelligence Backend running at ${HOST}:${PORT}`);
});
