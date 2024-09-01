const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_URI)
.then(()=>{
    console.log('db connected')
})
.catch((error)=>{
    console.log(`failed to connect the db${error}`)
})