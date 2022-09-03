const mongodb = require("mongodb");
require("dotenv").config();
const MongoClient = mongodb.MongoClient;

const mongoConnect = async () => {
  const connectionString = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.xbhna.mongodb.net/?retryWrites=true&w=majority`;
  console.log(connectionString);
  const client = await MongoClient.connect(connectionString);
  return client;
};

module.exports = mongoConnect;
