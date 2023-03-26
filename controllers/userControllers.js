let User = require('../models/user');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
//let md5 = require('md5');

function isstringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

function GenerateAccessToken(id ,name, isPremiumUser){
    return jwt.sign({userId:id,name:name,isPremiumUser:isPremiumUser }, 'secretkey')
}
let signup =async (req ,res)=>{
    try{

    let {name , email , phone , password} = req.body ;
       console.log('name:' + name , 'email :' +email , 'phone :' +phone , 'password :' +password);
    if(isstringValid(name) || isstringValid(email) || isstringValid(phone) || isstringValid(password)){
        
        res.status(400).json({err : 'something is missing' , success: false})
    }
    var salt = await bcrypt.genSalt(10); 

bcrypt.hash(password , salt ,async(err,hash)=>{
         let user = new User({name:name ,
             email:email ,
              phone:phone ,
               password:hash,
               isPremiumUser:false
             })
    await user.save();
       return res.status(201).json({success : true ,message:'successfully create new User'});

    })
}
catch(err){
        res.status(500).json({error: err, success: false})
    }
};

let signIn = async(req ,res)=>{
    try {
        let email = req.body.email;
        let password = req.body.password;
        if (email == "" || password == "") {
            return res.status(204).json({ success: false, message: `Please fill all feilds !` });
        }
        console.log(email, password,"<==============================");

        const user = await User.findOne({ email: email })

        console.log(user);
        if (!user) {
            return res.status(404).json({ success: false, message: `Error(404) : User ${email} does not exist` });
        } else {
            bcrypt.compare(password, user.password, (err, response) => {
                if (err) {
                    console.log(err);
                }
                if (response) {
                    // console.log(`responce ===>` ,response);
                    console.log(`user ==>`, user.id,user.name);
                    console.log(`secretkey ==>`, process.env.secretKey);
                    let token = GenerateAccessToken(user.id);
                    
                    console.log(`token===>` , token);
                    return res.status(201).json({ success: true, message: `User : ${user.name} logged in successfully.`, token: token });
                } else {
                    return res.status(400).json({ success: false, message: `Error(401) : Entered wrong password !` });
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err , message : `Something went wrong !`});
    }
}

module.exports = {
    signup,
    signIn,
    GenerateAccessToken,
}