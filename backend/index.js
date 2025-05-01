require('dotenv').config();
const express = require('express');
const UserRouter = require('./routers/userRouter');
const NGORouter = require('./routers/ngoRouter');
const SocialworkerRouter = require('./routers/socialworkerRouter');
const contactRouter = require('./routers/contactRouter');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;
//middleware
app.use(cors({ origin : '*'}))
app.use(express.json());
app.use('/user',UserRouter);
app.use('/ngo',NGORouter);
app.use('/socialworker',SocialworkerRouter);
app.use('/contact',contactRouter);
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