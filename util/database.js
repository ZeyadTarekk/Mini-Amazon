const mongodb = require("mongodb");
require("dotenv").config();
const MongoClient = mongodb.MongoClient;

let db;
const mongoConnect = async () => {
  const connectionString = `mongodb+srv://${process.env.user}:${process.env.password}@cluster0.xbhna.mongodb.net/shop?retryWrites=true&w=majority`;
  const client = await MongoClient.connect(connectionString);
  db = client.db();
};

const getDb = () => {
  if (db) return db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
