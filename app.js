const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const googleAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = googleAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
const express=require('express')
const app=express() 
const path=require('path')
const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/myapp')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")

app.get("/",async(req,res)=>{
    res.render("command")
})
app.post("/generate-email",async(req,res)=>{
  const {prompt}=req.body
  const result=await model.generateContent(prompt);
  res.send(result.response.candidates[0].content.parts[0].text)
})

app.listen(5000);
