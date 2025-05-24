require('dotenv').config();

const express = require('express');
const cors = require('cors');

const UserRouter = require('./routers/userRouter');
const NGORouter = require('./routers/ngoRouter');
const SocialworkerRouter = require('./routers/socialworkerRouter');
const contactRouter = require('./routers/contactRouter');
const feedbackRouter = require('./routers/feedbackRouter');
const casemanagementRouter = require('./routers/casemanagementRouter');
const postsRouter = require('./routers/postsRouter');

const app = express();

const port = process.env.PORT || 5000;

//middleware
app.use(cors({ origin: '*' }))
app.use(express.json());

app.use('/user', UserRouter);
app.use('/ngo', NGORouter);
app.use('/socialworker', SocialworkerRouter);
app.use('/contact', contactRouter);
app.use('/feedback', feedbackRouter);
app.use('/casemanagement', casemanagementRouter);
app.use('/posts', postsRouter);

app.listen(port, () => {
    console.log('server started at port ' + port);
});