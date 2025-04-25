const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },   
    address:String,
    exp:Number,
    geography:String,
    description:String,
    affiliatedTo : { type: String, default: 'None' }, // NGO, Government, etc.
    createdAt: { type: Date, default: Date.now }
});
module.exports = model('socialworker', mySchema);