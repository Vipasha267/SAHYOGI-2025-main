const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    Role: { type: String, default: 'individual' },
    bio: String,
    Government_ID:{type:Number, unique:true},
    address:String,
    type_of_SocialWork:String,
    year_of_experience:Number,
    ngo_name:String,
    ngo_Registration_Number:{type:Number,unique:true},
    geographic_area_of_Work:String,
    proof_of_work:String,
    createdAt: { type: Date, default: Date.now }
});
module.exports = model('ngo', mySchema);