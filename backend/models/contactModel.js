const {Schema, model}= require('../connection');

const contactSchema = new Schema({
     fullName :{ type:String},
     email : {type: String, unique : true},
      phone: { type:Number, unique : true},
      subject:{ type:String},
      message:{ type:String},
      isSocialWorker: { type:Boolean, default: false},
      inquiryType:{ type:String, enum: ['NGO', 'Social Worker', 'User'], default: 'User'},
      document:{ type:String},
      createdAt : {type: Date, default: Date.now}
});
module.exports = model('contact',contactSchema);