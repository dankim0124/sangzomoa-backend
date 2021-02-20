import express from 'express';
import testFunc from './lib/testFunc';
import bodyParser from 'body-parser';
import cors from 'cors';

import { putItem, queryByPK, querySKBeginsWith, updateItem, deleteItem, tableScan, testRead } from './lib/dynamoDB';
import { errorHandler } from './lib/errorHandler';
import uploadJSON from './lib/uploadsFuneral/funeralUploads';
import { kakaoLogin } from './lib/kakao';
import testItemSchema from './lib/uploadsFuneral/uploadFuneralItem';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(errorHandler);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/test', testRead);

app.get('/uplaodTest', testItemSchema);

app.get('/tableScan', tableScan);

app.get('/testLibrary', testFunc);

app.post('/queryByPK', queryByPK);

app.post('/querySKBeginsWith', querySKBeginsWith);

app.post('/putItem', putItem);

app.post('/updateItem', updateItem);

app.post('/deleteItem', deleteItem);

app.get('/uploadJSON', uploadJSON);

app.get('/kakaoLogin', kakaoLogin);

export default app;
