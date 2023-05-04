const mongoose = require("mongoose")
//mongodb+srv://akalatAdmin:Akalat12@cluster0.m7crdry.mongodb.net/?retryWrites=true&w=majority
const connection = async () => {
  return mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB database successfully!");
    }).catch((err) => {
      console.log("MongoDB Error: ", err);
    })
}

module.exports = {
  connection,
  mongoose,
  connect: () => {
    mongoose.Promise = Promise;
    mongoose.connect(uri);
  },
  disconnect: done => {
    mongoose.disconnect(done);
  }
};