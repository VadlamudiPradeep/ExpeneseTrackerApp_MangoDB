const mongoose = require('mongoose');
const Scheema = mongoose.Schema;

const FiledownloadScheema = new Scheema({
  fileURL : {  type: String, required : true },
  userId : { type : mongoose.Types.ObjectId, required : true},
  date : { type: Date, default: Date.now }
})

module.exports = mongoose.model('Filedownload' , FiledownloadScheema);