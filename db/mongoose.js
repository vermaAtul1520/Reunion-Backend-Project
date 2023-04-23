const mongoose = require('mongoose')
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connection to db is success');
}).catch(()=>{
    console.log('connection to db is fail');
})