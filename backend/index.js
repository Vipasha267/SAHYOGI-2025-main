require('dotenv').config();
const express = require('express');
const UserRouter = require('./routers/UserRouter');
const NGORouter = require('./routers/ngoRouter');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;
//middleware
app.use(cors({ origin : '*'}))
app.use(express.json());
app.use('/user',UserRouter);
app.use('/ngo',NGORouter);
//endpoint or root
app.get('/',(req,res) =>{
res.send('response from express');
});

app.get('/add', (req,res) =>{
    res.send('response from add');
});
app.get('/getall',(req,res) => {
    res.send('response from getall');
})
//getall
//delete

app.listen(port, () => {
console.log('server started');
});