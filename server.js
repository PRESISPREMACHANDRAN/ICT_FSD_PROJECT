

var Express=require('express');
var Mongoose=require('mongoose');
var Bodyparser=require('body-parser');
var Cors=require('cors');
const multer = require("multer");
const Bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const path = require('path')

const { RequirementModel } = require('./models/RequirementDB');
const {refFileModel} = require('./models/uploadRefFile');
const { CurriculumFaculty } = require('./models/uploadCurriculum');
const {  TextModel } = require('./models/Comment');
const { curriculumModel } = require('./models/curriculumDB.JS');
const {currFileModel} = require('./models/curriculumFileDB');
const UserModel =require('./models/UserModel')



var app=new Express();
app.use(Bodyparser.json());
app.use(Bodyparser.urlencoded({extended:false}))
app.use(Cors());



Mongoose.connect('mongodb+srv://presi:presi@cluster0.dbexxum.mongodb.net/curriculum_tracker1?retryWrites=true&w=majority',{ useNewUrlParser: true})
 app.use(Express.static(path.join(__dirname,'/frontend/build')));
app.get('*', function(req, res) {res.sendFile(path.join(__dirname,'/frontend/build/index.html')); }); 


//(1)add requirement data by admin--requirementDB.js
// app.post('/add',async(req,res)=>{
//     var data=req.body
//     var requirement=new RequirementModel(data);
//     await requirement.save((err,data)=>{
//         if(err){
//             res.json({'Status':'Error','Error':err})
//             console.log(err)
//         }else{
//             res.json({'Status':'Success','Data':data})
//         }
//     })
//     console.log(data)  
// })



//(2)upload reference file by admin -- reffile.js
//npm install multer gridfs-stream express-fileupload mongodb
// Configure multer for file uploads
// const upload = multer({
//     storage: multer.memoryStorage()
// });

// const upload = multer({ dest: 'uploads/' }); // specify upload directory

// app.post('/upload', upload.single('file'), (req, res) => {
  // handle file upload
// });

// app.post('/files', upload.single('RefFile'), async (req, res) => {
//     const { originalname, buffer } = req.file;
//     const customName ='Ref-File-Admin'; // set a custom name here

//     const refFile = new refFileModel({
//         name: customName,
//         data: buffer
//     });

//     try {
//         await refFile.save();
//         return res.send({ message: 'File uploaded successfully' });
//     } catch (error) {
//         return res.status(500).send({ error: error.message });
//     }
// });

// Requirement BY ADMIN
//FILE UPLOAD
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, './uploads')	//foldername
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname + Date.now().toString()+'.pdf')
    }
})


//middleware
const upload = multer({storage: fileStorageEngine});

app.post('/add',upload.single("photo"), async (req, res) => {

    try {
        let data1 = {
            reqname: req.body.reqname,
            area: req.body.area,
            institution: req.body.institution,
            catagory: req.body.catagory,
            hours: req.body.hours,
            imgpath:req.file.photo

        }
        console.log(data1);
        const newReq = new ReqModel(data1);
        newReq.save((err,data)=>{
            if (err) {
                res.json({"error":err});
            } else {
                res.json({"status":"success","data":data})
            }
        });
            
            
        // let requirements = await ReqModel.findOne({ reqname: req.body.reqname })
        // if (!requirements) {
        //     const newReq = new ReqModel(data1);
        //     const saveReq = await newReq.save();
        //     res.json(saveReq);
        //     console.log(saveReq)
        // }
        // else {
        //     res.json({ message: "Requirement already added" });
        // }
    } catch (error) {
        console.log(error)

    }
})



//(3)faculty can view requirement from requirementDB

app.get('/requirements/:id', async (req, res) => {
    try {
        const requirement = await RequirementModel.findById(req.params.id);
        return res.send(requirement);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});


app.get('/requirements', async (req, res) => {
    try {
        const requirement = await RequirementModel.find();
        return res.send(requirement);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});



//(4)FACULTY CAN download reference file UPLOADED BY ADMIN 

app.get('/refFiles/:id', async (req, res) => {
    try {
        const file = await refFileModel.findById(req.params.id);
        if (!file) {
            return res.status(404).send({ message: 'File not found' });
        }

        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${file.name}`);

        return res.send(file.data);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});





//(5)upload CURRICULUM file by faculty to upload uploadCurriculumDB-uploadcuri.js
app.post('/upload/curriculum', async(req, res) => {
    const fieldName = req.query.fieldName || 'file';
    console.log("field",req.body)
    upload.single(fieldName)(req, res, async (err) => {
        if (err) {
            return res.status(400).send({ error: err.message });
        }
        const file = new CurriculumFaculty({
            name: req.body.file
            // data: req.file.buffer
        });

        try {
            await file.save();
            return res.send({ message: 'File uploaded successfully' });
        } catch (error) {
            return res.status(500).send({ error: error.message });
        }
    });
});


//(6)comment-response(by faculty) TO commentdb--comment.js
app.post("/comments", async (req, res) => {
    try {
    const content = new TextModel({
        content: req.body.content,
      });
      const savedComment = await content.save();
      res.json(savedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  



//(7)download curriculum file send by faculty by admin from uploadCurriculumDB
app.get('/files/:id', async (req, res) => {
    try {
        const file = await CurriculumFaculty.findById(req.params.id);
        if (!file) {
            return res.status(404).send({ message: 'File not found' });
        }

        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${file.name}`);

        return res.send(file.data);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//(8)admin can view comment--comment.js
app.get('/api/comments', async (req, res) => {
    try {
      const comments = await TextModel.find({});
      res.status(200).json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });



//when admin click approve button,form will display
//(9)type the data by admin to curriculumDB--
app.post('/curriculum/add',async(req,res)=>{
    var data=req.body
    var requirement=new curriculumModel(data);
    await requirement.save((err,data)=>{
        if(err){
            res.json({'Status':'Error','Error':err})
            console.log(err)
        }else{
            res.json({'Status':'Success','Data':data})
        }
    })
    console.log(data)  
})

//(10)upload curriculum by admin curriculumFileDB
const upload1 = multer({
    storage: multer.memoryStorage()
});

app.post('/files/upload', upload1.single('File'), async (req, res) => {
    const { originalname, buffer } = req.file;
    const customName ='File-Admin'; // set a custom name here

    const refFile = new currFileModel({
        name: customName,
        data: buffer
    });

    try {
        await refFile.save();
        return res.send({ message: 'File uploaded successfully' });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});



//(10)edit all the details for a given Requirementname  in curriculumDB by admin only
app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const updatedData = await curriculumModel.findByIdAndUpdate(id, data, { new: true });
    res.json({ status: 'Success', data: updatedData });
    } catch (err) {
    res.json({ status: 'Error', error: err });
    }
});

//postman->http://localhost:8080/update/63ecf57973b6da405104d3d5
//{

//"institution":"ckllhjhemp",
//"duration":1000
//}


//(11)delete all the details for a given Requirement id by admin only in curriculumDB
app.delete('/delete/:id', async (req, res) => {
    try {
    const id = req.params.id;
    const deletedDoc = await curriculumModel.findByIdAndDelete(id);
    if (!deletedDoc) {
        return res.status(404).json({ error: 'Document not found' });
    }
    return res.json({ message: 'Document deleted successfully', data: deletedDoc });
    } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
    }
});

//http://localhost:8080/delete/63ecf57973b6da405104d3d5



//(12)view all curriculums from curriculumDB (FOR both admin and faculty)
app.get('/viewall',(req,res)=>{
    curriculumModel.find(
        (err,data)=>{
        if(err){
            res.json({'Status':'Error','Error':err})
        }else{
            res.json(data)
        }
    })
})


//(13)search requirement (for both admin and faculties) from curriculumDB
// Area of training
// Name of training
// Category of Requirement
// Institution

app.get('/search',(req,res)=>{
    var data=req.body
    curriculumModel.find(data,(err,data)=>{
        if(err){
            res.json({'Status':'Error','Error':err})
        }else{
            res.json(data)
        }
    })  
})



//(14)download all approved curriculums FROM curriculumDB
// Route for file download
app.get('/file/:id', async (req, res) => {
    try {
    const file = await currFileModel.findById(req.params.id);

    if (!file) {
        return res.status(404).send({ error: 'File not found' });
    }

    res.set({
        'Content-Type': file.contentType,
        'Content-Disposition': `attachment; filename="${file.name}"`
    });

    return res.send(file.data)
    } catch (error) {
    return res.status(500).send({ error: error.message });
    }
});


//get->http://localhost:8080/files/63edf8de2592f738d3cc7c98 ->send->save response->

app.post('/signup', async (req, res) => {
    try {
      const { firstName, lastName, email, username, password, confirmPassword ,role } = req.body;
  
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      const hashedPassword = await Bcrypt.hash(password, 10);
      const newUser = new UserModel({
        firstName,
        lastName,
        email,
        username,
        password: hashedPassword,
        confirmPassword:hashedPassword,
        role
      });
      await newUser.save();
      res.json({ message: 'User created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  
//lOGIN
app.post("/login",(req,res)=>{
    try{  
       var email =req.body.email;
       var password=req.body.password;
       var role=req.body.role;
        
    //    if(email=="admin@gmail.com",role=="admin"){
    //     res.json({message :"admin login"})
    //    }
    //     else{
            UserModel.find({ email : email },(err,data)=>{
            if(data.length>0){
               
               const PasswordValidator=Bcrypt.compareSync(password,data[0].password)
               if(PasswordValidator){
                    jwt.sign({email :email ,id:data[0]._id},"ictakproject",{expiresIn:"1d"},
                    (err,token)=>{
                       if (err) {
                           res.json({"status":"error","error":err}) 
                       } 
                       else {
                           res.json({"status":"success","data":data,"token":token})
                           
                       }
                    })
                   
               }
               else{
                   res.json({"Status":"Failed to Login","data":"Invalid Password"})
               }
           }
           else{
               res.json({"Status":"Failed to Login","data":"Invalid Email id"})
           }
       })
//    }
}catch(error){
       console.log(error)
   }
    
   })

   app.get('/view/:id', async (req, res) => {
    try {
      const requirement = await curriculumModel.findById(req.params.id);
      res.status(200).json(requirement);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  



app.listen(8080,()=>{
    console.log('server running on port 8080')
})