import path from 'path';
import fs from 'fs';
import AWS from 'aws-sdk';

const testItemSchema = async (req, res, next) => {
  const __dirname = path.resolve();
  const itemPath = path.join(__dirname, '/jsons/funeralServices copy.json');
  console.log(itemPath);
  const itemData = await fs.promises.readFile(itemPath);
  let itemJSON = JSON.parse(itemData.toString());
  try {
    let i = 1;
    console.log('totalLenth : ', itemJSON.length);
    for (const item of itemJSON) {
      putItem(item);
      console.log(`${i} 번째 시행`);
      await delay(1000);
    }
    console.log('complete');
    res.status(200).send('complete');
  } catch (e) {
    next(e);
  }
};

const delay = (t, v) =>
  new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
const putItem = async (item) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const TABLE_NAME = process.env.DYNAMODB_TABLE;

  const keys = Object.keys(item);
  const items = {};
  for (const key of keys) {
    items[key] = item[key];
  }
  try {
    const params = {
      TableName: TABLE_NAME,
      Item: items,
    };
    console.log(params);
    await dynamoDb.put(params).promise();
  } catch (e) {
    console.log(e);
  }
};

export default testItemSchema;
