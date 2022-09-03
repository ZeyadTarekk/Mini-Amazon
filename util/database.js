const mongodb = require("mongodb");
require("dotenv").config();
const MongoClient = mongodb.MongoClient;

let db;
const mongoConnect = async () => {
  try {
    const connectionString = `mongodb://localhost:27017/shop`;
    const client = await MongoClient.connect(connectionString);
    db = client.db();
  } catch (err) {
    console.log(err);
  }
};

const getDb = () => {
  if (db) return db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
