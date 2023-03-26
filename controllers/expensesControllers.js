const { ids_v1 } = require('googleapis');
let Expenses = require('../models/expenses');

function isstringValid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
};

let AddExpenses = async(req ,res)=>{
    try {
        let {expenses , description , category } = req.body;
        const expense = new Expenses({
            expenses: expenses,
            description:description,
            category:category,
            userId : req.user.id
        })
        await expense.save();   
        return res.status(201).json({ success: true, expense });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }

};

let GetExpense = async(req , res)=>{
    try{
        console.log(req.query);
        let exp_per_page = +(req.query.numberOfRows) || 4;

        const page = +req.query.page || 1;
        const totalExp = await Expenses.find({userId : req.user._id})

        const numberOfTotalExp = totalExp.length;
    
        const expenses = await Expenses.find({ userId : req.user._id })
        .skip( (page-1) * exp_per_page )
         .limit( exp_per_page );
     
        return res.status(200).json({ 
            success: true,
            expenses,
            isPremium: req.user.isPremiumUser,
            name: req.user.name,
            currentPage: page,
            hasNextPage: exp_per_page * page < numberOfTotalExp,
            nextPage : page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage : Math.ceil(numberOfTotalExp / exp_per_page),
        });
       
      
    }catch(err){
        res.status(500).json({error:err , success:false , message:'Failed to fetch data from the database'})
    }
};

const DeleteExpense = async (req, res) => {
    
    try{
     const id = req.params.id;
        // console.log('epxnId======>'+ExpId)
        if(isstringValid(id)){
            return res.status(400).json({success: false,message:`user id :is ${ExpId} is missing` })
        }
       let response = await Expenses.findByIdAndDelete({_id:id})
   
        return res.status(200).json({response, success: true, message: "Deleted Successfully"})
     
    }catch(err){

        res.status(500).json({error:err , success:false , message:'Failed to delete data from the database'})
    }
};

const AWS = require('aws-sdk');

updloadToS3 = (data, filename) => {
    const BUCKET_NAME = BUCKET_NAME
    const IAM_USER_KEY =USER_KEY ;
    const IAM_USER_SECRET = SECRET_KEY;

    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })
    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve, reject) => {
        s3Bucket.upload(params, (err, s3responce) => {
            if (err) {
                console.log(`Something went wrong`, err);
                reject(err);
            } else {
                console.log(`work has done ===>`, s3responce);
                resolve(s3responce.Location);
            }
        })
    })
}


const Filedownload = require('../models/filedownloaded');
const downloadExpenses =  async (req, res) => {
    try {
        // console.log(`123` , req.user);
        const expences = await Expenses.find({userId : req.user._id});
        // console.log(`abc` , expences);
        const stringifiedExpences = JSON.stringify(expences);
        const filename = `Expenenses-${req.user._id}/${new Date()}.txt`;
        const fileURL = await updloadToS3(stringifiedExpences, filename);

        // console.log(fileURL);
        const file = new Filedownload({
            fileURL: fileURL,
            userId : req.user._id
        })
        await file.save();
        return res.status(200).json({ fileURL, success: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
};


// Pagination
var ItemsPerPage = 2;

// Records per page
const updatePages=(req,res,next)=>{
    console.log(req.params.pages)
    ItemsPerPage=parseInt(req.params.pages)
    res.status(200).send({updated:true})
}

const pagination = async(req,res)=>{
    let totalExpenses ; 
    let pos = 0;
    let neg = 0;
    let page = +req.params.pageNo || 1;

    let Items =  Expenses.find({userId:req.user._id})
    .then(response=>{
        totalExpenses = response.length ;
        response.map(i =>{
            (i.amount > 0 )?pos += i.amount:neg+=i.amount;

        })
    })
    .catch(err=>{
        console.log(err);
    });
    await Items;
    Expenses.find({userId:req.user._id},{
    offset:(page - 1) * ItemsPerPage , // offset : cluasees specifec rows the numbers of rows of the result table  to skip before any rows are retrived
    limit:ItemsPerPage , // limit allows to limit the number of rows returned form query
    })
    .then(response =>{
        res.status(200).send({
            response : response,
            currentPage : page ,// current page the page which page is we are on now
            hasNextPage:ItemsPerPage * page < totalExpenses,
            hasPreviousPage : page > 1, // if pagination has previous page check the page > 1
            nextPage : page + 1 , // if there is next page just increase the page
            previousPage:page - 1 ,// if there is previous page just decrease the pge
            lastPage : Math.ceil(totalExpenses / ItemsPerPage),
            Items:totalExpenses,
        })
    })
}

module.exports = {
    AddExpenses,
    GetExpense,
    DeleteExpense,
    downloadExpenses,
    pagination,
    updatePages
}