const csv =  require('csv-parser');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid').v4;

const handleCsvFiles = (req,res)=>{
    try{
        console.log('---inside handleCSVFiles api-----');
        const filepath = path.join(__dirname ,'../uploads',req.file.filename)
        const requestid = uuid();

        fs.createReadStream(filepath)
        .pipe(csv())
        .on('data',(row)=>{
            
        })
        return res.send(filepath)
    }catch(error){
        console.log(error);
        return res.json({status:false,result:`error occured while handeling compress job ${error.message}`})
    }
};

const getImgProcessingStatus = (req,res)=>{

};

module.exports={handleCsvFiles,getImgProcessingStatus};