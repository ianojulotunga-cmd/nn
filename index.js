import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
import path from 'path';
import {fileURLToPath} from 'url';
dotenv.config();
const app=express();app.use(cors());app.use(express.json());
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const root=path.join(__dirname,'..');
function timestamp(){const d=new Date();const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`}
async function token(){const base=process.env.DARAJA_ENV==='production'?'https://api.safaricom.co.ke':'https://sandbox.safaricom.co.ke';const key=process.env.DARAJA_CONSUMER_KEY;const secret=process.env.DARAJA_CONSUMER_SECRET;if(!key||!secret)throw new Error('Daraja credentials are not configured on the server.');const auth=Buffer.from(`${key}:${secret}`).toString('base64');const r=await axios.get(`${base}/oauth/v1/generate?grant_type=client_credentials`,{headers:{Authorization:`Basic ${auth}`}});return r.data.access_token}
function normalizePhone(p){let x=String(p||'').replace(/\D/g,'');if(x.startsWith('0'))x='254'+x.slice(1);if(x.startsWith('7')&&x.length===9)x='254'+x;if(!/^2547\d{8}$/.test(x))throw new Error('Enter a valid Kenyan mobile number, e.g. 0712345678.');return x}
app.post('/api/mpesa/stkpush',async(req,res)=>{try{const amount=Math.max(1,Math.round(Number(req.body.amount)));const phone=normalizePhone(req.body.phone);const shortcode=process.env.DARAJA_SHORTCODE;const passkey=process.env.DARAJA_PASSKEY;if(!shortcode||!passkey)throw new Error('Daraja shortcode/passkey are not configured.');const ts=timestamp();const password=Buffer.from(`${shortcode}${passkey}${ts}`).toString('base64');const base=process.env.DARAJA_ENV==='production'?'https://api.safaricom.co.ke':'https://sandbox.safaricom.co.ke';const access=await token();const payload={BusinessShortCode:shortcode,Password:password,Timestamp:ts,TransactionType:'CustomerPayBillOnline',Amount:amount,PartyA:phone,PartyB:shortcode,PhoneNumber:phone,CallBackURL:process.env.DARAJA_CALLBACK_URL,AccountReference:'WCSmart',TransactionDesc:'Store order'};const r=await axios.post(`${base}/mpesa/stkpush/v1/processrequest`,payload,{headers:{Authorization:`Bearer ${access}`,'Content-Type':'application/json'}});res.status(r.data.ResponseCode==='0'?200:400).json({message:r.data.CustomerMessage||r.data.ResponseDescription||'Payment request submitted.',checkoutRequestID:r.data.CheckoutRequestID,merchantRequestID:r.data.MerchantRequestID});}catch(e){console.error(e.response?.data||e.message);res.status(400).json({error:e.response?.data?.errorMessage||e.message||'Payment request failed.'})}});
app.post('/api/mpesa/callback',(req,res)=>{const callback=req.body?.Body?.stkCallback;console.log('M-Pesa callback:',JSON.stringify(callback));res.json({ResultCode:0,ResultDesc:'Accepted'});});
app.get('/api/health',(req,res)=>res.json({ok:true,store:'Wide City Smart Digital Homes'}));
app.use(express.static(path.join(root,'dist')));app.get('*',(req,res)=>res.sendFile(path.join(root,'dist','index.html')));
const port=process.env.PORT||5000;app.listen(port,()=>console.log(`Wide City server running on port ${port}`));
