import path from 'path';
import fs from 'fs';

import {putItem_} from "../dynamoDB";
import {delay} from "../delay";

const testItemSchema = async (req, res, next) => {
  const __dirname = path.resolve();
  const itemPath = path.join(__dirname, '/jsons/funeralServices.json');
  console.log(itemPath);
  const itemData = await fs.promises.readFile(itemPath);
  let itemJSON = JSON.parse(itemData.toString());

  try {
    let i = 1;
    console.log('totalLenth : ', itemJSON.length);
    for (const item of itemJSON) {
      putItem_(item);
      i = i + 1;
      console.log(`${i} 번째 시행`);
      await delay(1000);
    }
    console.log('complete');
  } catch (e) {
    next(e);
  }
  res.status(200).send({ success: true });
};


export default testItemSchema;
