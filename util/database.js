const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://zeyad:1234@cluster0.xbhna.mongodb.net/?retryWrites=true&w=majority"
  );
  return client;
};

module.exports = mongoConnect;
