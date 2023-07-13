const express=require('express');
const request=require('request');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const cors=require('cors');

const app=express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'./views/pages'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyparser.json())
app.use(cors());
const port=4000;