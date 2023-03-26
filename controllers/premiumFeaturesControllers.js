let User  = require('../models/user');
let Expense = require('../models/expenses');


let GetUserLeaderBoard =  async (req, res) => {
    try {
        const allUsersExpences = await Expense.aggregate([
            /*aggregate() method on the model to create an aggregation pipeline. Within the pipeline,
             you can use the $group operator to group documents based on a specific field or set of fields. */
            {
                $lookup: { /*$lookup is a pipeline stage operator in the MongoDB aggregation 
                framework that allows you to perform a left outer join between two collections in the same database. */
                  from: "users",
                  localField: "userId",
                  foreignField: "_id",
                  as: "user"
                }
            },
            {
                $unwind: "$user" /*$unwind is a pipeline stage operator in the MongoDB aggregation framework that allows you to break down an array
                 field into separate documents in the aggregation pipeline */
            },
            {
                $group : {  
                    /*$group is a pipeline stage operator in the MongoDB aggregation framework that allows you to group documents by a specific field or set of fields, and apply aggregation functions to each group. In Mongoose, you can use $group as a method to perform the same operation in a more streamlined way.

To use $group in Mongoose, you need to include it as a stage in your aggregation pipeline, specifying the _id field that you want to group by, as well as any other fields you want to include in the output. You can also apply any of the available aggregation functions to each group, such as $sum, $avg, $min, $max, and $first */
                    _id: {
                        _id: "$userId",
                        name: "$user.name",
                        email: "$user.email"
                      },
                    total_amount : { $sum : "$expenses.expenses" }
                },
            },
            {
                $sort : { total_amount : -1}
            }
        ])
        
        console.log('==============================================')
        console.log(allUsersExpences);

        let data = allUsersExpences.map(expence => {
            return {name : expence._id.name, total_amount : expence.total_amount}
        })
        console.table(data);
        return res.status(201).json({ success: true, data: data });
        
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err });
    }
};

//const AWS = require('aws-sdk');

// updloadToS3 = (file, filename) => {
//     const BUCKET_NAME = 'chatapplicationapp';
//     const IAM_USER_KEY = 'AKIA6E35YDHT7AL6AEOG'
//     const IAM_USER_SECRET = '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'

//     let s3Bucket = new AWS.S3({
//         accessKeyId: IAM_USER_KEY,
//         secretAccessKey: IAM_USER_SECRET,
//     })
//     var params = {
//         Bucket: BUCKET_NAME,
//         Key: filename,
//         Body: file,
//         ACL: 'public-read'
//     }
//     return new Promise((resolve, reject) => {
//         s3Bucket.upload(params, (err, s3responce) => {
//             if (err) {
//                 console.log(`Something went wrong`, err);
//                 reject(err);
//             } else {
//                 console.log(`work has done ===>`, s3responce);
//                 resolve(s3responce.Location);
//             }
//         })
//     })
// }




module.exports = {
    GetUserLeaderBoard
}