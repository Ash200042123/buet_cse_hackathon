const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const cors=require('cors');
const Register=require('./registerSchema');
const Vaccine=require('./vaccineSchema');
const path=require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const pdfService = require('./service//pdf-service');


const app=express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'./views'));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyparser.json())
app.use(cors());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,maxAge: 1000*60*60*24 }
  }));
const port=4000;

app.use(express.json());


app.set('trust proxy', 1) // trust first proxy


const uri = "mongodb+srv://ashchow018:ashchow018@cluster0.zdws2d7.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{console.log('mongodb connected');});



const generateRandomDate= ()=> {
   
    const currentDate = new Date();
    const minDate = new Date();
    const maxDate = new Date();
    minDate.setDate(currentDate.getDate() + 5);
    maxDate.setMonth(currentDate.getMonth() + 2);
  
    const randomDate = new Date(minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime()));
    return randomDate.toLocaleDateString();
  }
  
  const generateRandomID=()=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
  
    return id;
  }



const generatePDFWithNID = (NID) =>{
  // Create a new PDF document
  const doc = new PDFDocument();

  // Set the file name for the PDF
  const fileName = '${NID}_document.pdf';

  // Pipe the PDF document to a writable stream
  const writeStream = fs.createWriteStream(fileName);
  doc.pipe(writeStream);

  // Add content to the PDF
  doc.fontSize(18).text('${NID} is vaccinated now!', { align: 'center' });

  // Finalize the PDF and close the write stream
  doc.end();
  writeStream.on('finish', () => {
    console.log('PDF with NID ${NID} generated successfully.');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(path.resolve(fileName), (error) => {
      if (error) {
        console.error('Error sending PDF:', error);
        res.status(500).send('Error sending PDF');
      }
      // Delete the PDF file after sending
      fs.unlinkSync(fileName);
    });
  });

  // Handle any error during PDF generation
  doc.on('error', (error) => {
    console.error('Error generating PDF:', error);
  });
};







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
                message: 'Password cannot be blank.'
              });
            }
            const isValidMobileNumber = /^01\d{9}$/.test(phoneno);
            if(!isValidMobileNumber){
                return res.send({
                    success: false,
                    message: 'Invalid mobile number.'
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






app.get('/signin',(req,res)=>{
    if(req.session.NID){
        res.redirect('/vaccineregistration');
    }else{
        res.render("Login");
    }
    
});


app.post('/signin',async (req,res)=>{
    try{
        const result=await Register.findOne({phoneno:req.body.phoneno});
        if(result==null)
        {
          return res.send({
            success:false,
            message:'No User Found'
          })
        }
        else
        {
          try{
             req.session.NID=result.NID;
            console.log(req.session.NID);
            res.redirect('/vaccineregistration');
          }
          catch(e)
          {
            console.log(e.message)
          }
        
        }
     }catch(e)
     {
          console.log(e.message)
     }
});




app.get('/vaccineregistration',(req,res)=>{
    // if(req.session.NID){
        const nid =req.session.NID;
        console.log(req.session);
        res.render("Vaccination",{NID: nid});
    // }else{
    //     res.redirect('/signin');
    // }
    
});




app.post('/vaccineregistration',async (req,res)=>{
    try{
        const result=await Register.findOne({NID:req.body.NID})
        if(result==null)
        {
          return res.send({
            success:false,
            message:'No User Found'
          })
        }
        else
        {
            const currentDate = new Date();
            if(result.vaccine_date != null || result.vaccine_date > currentDate){
                return res.send({
                    success:true,
                    message:'Your vaccination date is already fixed which is '+result.vaccine_date.toLocaleDateString()+' with vaccine ID '+result.vaccine_id
                  })
            }
          try{
            const randomDate = generateRandomDate();
            const randomID = generateRandomID();
            // console.log(randomDate);

            const vaccine = new Vaccine();
            vaccine.vaccine_id = randomID;
            vaccine.vaccine_name = req.body.vaccine_name;
            vaccine.save();
            
            Register.findOneAndUpdate(
                { NID: req.body.NID },
                { vaccine_date: randomDate , vaccine_id: vaccine.vaccine_id},
                { new: true }
              ).then(updatedInstance => {
                  if (updatedInstance) {
                    return res.send({
                        success:true,
                        message:'Your vaccination date is '+randomDate+' and Vaccine Id is '+vaccine.vaccine_id
                      })
                  } 
                })
                .catch(error => {
                  console.log('Error updating instance:', error);
                });
          }
          catch(e)
          {
            console.log(e.message)
          }
        
        }
     }catch(e)
     {
          console.log(e.message)
     }
});




app.get('/getcertificate', async(req, res,next) => {
    
    const NID = req.session.NID;
    const result=await Register.findOne({NID:NID});
    const vaccine_id=result.vaccine_id
    const vaccine = await Vaccine.findOne({vaccine_id:vaccine_id});
    const vac_name = vaccine.vaccine_name;


const stream = res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment;filename=invoice.pdf`,
  });
  pdfService.buildPDF(
    (chunk) => stream.write(chunk),
    () => stream.end(),
    NID, vaccine_id, vac_name
  );

  });


  app.get('/certificate',(req,res)=>{
    res.render("Certificate", {NID : req.session.NID});
});












app.listen(port,()=>console.log(`Running on port ${port}`));



