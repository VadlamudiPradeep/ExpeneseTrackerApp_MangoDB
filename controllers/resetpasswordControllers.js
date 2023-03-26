
require('dotenv').config();
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { google } = require('googleapis')

const User = require('../models/user');
const Forgotpassword = require('../models/forgotPassword');

const dotenv = require('dotenv');

// get config 
dotenv.config();

const  CLIENT_ID =process.env.CLIENT_ID;
const  CLIENT_SECRET =process.env.CLIENT_SECRET;
const REDIRECT_URI =  process.env.REDIRECT_URI
const REFRESH_TOKEN =process.env.REFRESH_TOKEN ;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const forgotpassword = async(req,res)=>{
    try {

        const email = req.body.email;
        const accessToken = await oAuth2Client.getAccessToken();
    
        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: 'vadlamudipradeeep2000@gmail.com',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN,
            accessToken: accessToken,
          },
        });
    
        const mailOptions = {
          from:'<vadlamudipradeep2000@gmail.com>',
          to: email,
          subject: 'Hello from gmail using API',
          text: 'Hello from gmail email using API',
          html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
        };
    
        const result = await transport.sendMail(mailOptions);
        return res.status.json({result:result ,success:true})
      } catch (error) {
        return error;
      }
}



const resetpassword = async(req, res) => {
    
        const id = req.params.id;
        console.log('-----------------------------------------------------------', id);
        Forgotpassword.findOne({ id: id })
        .then(forgotpasswordrequest => {
            if(!forgotpasswordrequest){
                return  res.status(404).send(`<html> <h1>Something went wrong !</h1> </html>`)
            }
            if (forgotpasswordrequest.isActive){
                forgotpasswordrequest.isActive = false;
                return forgotpasswordrequest.save()
                .then((result) => {
                    // console.log(result);
                    return res.status(200).send(`<html>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password"></input>
                                        <button>Reset Password</button>
                                    </form>
                                </html>`)
                })
            }else if(!forgotpasswordrequest.isActive){
                return res.status(500).send(`<html>
                                        <h1>Link expired !</h1>
                                        <h2>Go back and generate another link.</h2>
                                    </html>`
                )
            }else{
                return res.status(404).send(`<html>
                                        <h1>Something went wrong !</h1>
                                    </html>`
                )
            }
        })
    
}

const updatepassword = async(req, res, next)=>{
    
    const { newpassword } = req.query;
    
    const id = req.params.id;
    try {
        const data = await Forgotpassword.findOne({ id : id })
        // console.log(data);
        const user = await User.findOne({email: data.email });
        if (user) {
            
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword , salt , (err, hash) => {
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    user.update({password : hash})
                    .then(() => {
                        
                        return res.redirect('http://localhost:3000/login.html');
                        // return res.status(201).json({success : true, message: 'Successfully updated new password'});
                    })
                })
            })
        }else{
            return res.status(400).json({success : false , error : `No user exist`})
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({success : false , error : err})
    }
}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}