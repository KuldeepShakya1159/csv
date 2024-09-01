require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const imgComporessJobRoutes = require('./routes/ImgCompressJobRoutes');

app.use('/job',imgComporessJobRoutes);

app.get('/',(req,res)=>{
    res.send('server is working')
})

app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
});
