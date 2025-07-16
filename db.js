const mongoose = require('mongoose')
const dburl = 
'mongodb+srv://sudheerkusume321:Sudheerkusume@cluster0.8k2eo9b.mongodb.net/hotel?retryWrites=true&w=majority&appName=Cluster0'  

mongoose.connect(dburl)
.then(() =>{
    console.log('Database was Connected');
})
.catch((err) =>console.log(err))