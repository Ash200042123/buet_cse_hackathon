const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const cors=require('cors');
const Register=require('./registerSchema');
const path=require('path');


const app=express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'./views'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyparser.json())
app.use(cors());
const port=4000;

app.use(express.json());

const uri = "mongodb+srv://ashchow018:ashchow018@cluster0.zdws2d7.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{console.log('mongodb connected');})


app.post('/register',async(req,res)=>{
    try
    {
        console.log(req.body)
        const {body}=req;
        const {password,confirm_password}=body;
        if(password===confirm_password)
        {
          const{first_name,password,phoneno,addr1,NID}=body;
          
            if (!password) {
              return res.send({
                success: false,
                message: 'Error: Password cannot be blank.'
              });
            }
            
            Register.find({ phoneno: phoneno })
  .then(previousUsers => {
    if (previousUsers.length > 0) {
      return res.send({
        success: false,
        message: 'Error: Account already exists.'
      });
    }

    const reg = new Register();
    reg.first_name = first_name;
    reg.password = password;
    reg.phoneno = phoneno;
    reg.NID = NID;
    reg.addr1 = addr1;

    return reg.save();
  })
  .then(() => {
    return res.send({
      success: true,
      message: 'User successfully registered'
    });
  })
  .catch(error => {
    return res.send({
      success: false,
      message: 'Error: Server error'
    });
  });

        }
        else{
          res.send({
            success:false,
            message:'Error:Password and Confirm Password does not match'
          })
        }
    }
    catch(error)
    {
        res.status(400).send(error.message)
    }
})

app.get('/register',(req,res)=>{
    res.render("Register", {first_name : "Enter name"});
});

app.listen(port,()=>console.log(`Running on port ${port}`));



