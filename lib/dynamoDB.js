import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE;

export const putItem = async (req, res, next) => {
  const { PK, SK, any } = req.body;
  const date = new Date().toISOString();
  const uuid = uuidv4();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: PK,
      SK: SK,
      any: any,
      createdAt: date,
      updateAt: date,
      uuid: uuid,
    },
  };

  try {
    const result = await dynamoDb.put(params).promise();
    res.status(200).send({ ...params, result: result });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getItemByPK = async (req, res, next) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: 'PK1',
      SK: 'SK1',
    },
  };
  console.log(params);
  const result = await dynamoDb.get(params).promise();
  console.log(result);
  res.status(200).send(result);
};

export const getItemBySK = async (req, res, next) => {};

export const queryByPK = async (req, res, next) => {
  console.log('query by pk ');
  try {
    const params = {
      TableName: TABLE_NAME,
      ExpressionAttributeNames: {
        '#pk': 'PK',
      },
      ExpressionAttributeValues: {
        ':pk': req.body.PK,
      },
      KeyConditionExpression: '#pk = :pk',
    };
    console.log(params);
    const result = await dynamoDb.query(params).promise();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log('params : ', req.body);
    console.log('queryByPk failed');
    console.log(e);
    next(e);
  }
};

export const testRead = async (req, res, next) => {
  console.log('this is test read');
  try {
    const PK = 'PK1';
    const SK = 'SK1';
    const params = {
      TableName: TABLE_NAME,
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':PK': PK,
        ':SK': SK,
      },
      KeyConditionExpression: '#pk = :PK and begins_with(#sk, :SK)',
    };

    console.log(params);
    const result = await dynamoDb.query(params).promise();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log('params : ', req.body);
    console.log('querySKBeginsWith failed');
    console.log(e);
    next(e);
  }
};

export const querySKBeginsWith = async (req, res, next) => {
  try {
    const { PK, SK } = req.body;
    const params = {
      TableName: TABLE_NAME,
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':PK': PK,
        ':SK': SK,
      },
      KeyConditionExpression: '#pk = :PK and begins_with(#sk, :SK)',
    };

    console.log(params);
    const result = await dynamoDb.query(params).promise();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log('params : ', req.body);
    console.log('querySKBeginsWith failed');
    console.log(e);
    next(e);
  }
};

// attribute 동적으로 설정가능하게 수정 ... .오늘 밤에 .
export const updateItem = async (req, res, next) => {
  try {
    const { SK, PK, any } = req.body;
    const updatedAt = new Date().toISOString();
    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK: PK,
        SK: SK,
      },
      UpdateExpression: 'SET #any=:any, #updatedAt =:updatedAt',
      ExpressionAttributeValues: {
        ':any': any,
        ':updatedAt': updatedAt,
      },
      ExpressionAttributeNames: {
        '#any': 'any',
        '#updatedAt': 'updateAt',
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const result = await dynamoDb.update(params).promise();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log('params : ', req.body);
    console.log('error on updateItem');
    next(e);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const { PK, SK } = req.body;
    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK: PK,
        SK: SK,
      },
    };
    const result = await dynamoDb.delete(params).promise();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log('error on deleteItem');
    console.log('params : ', req.body);
    next(e);
  }
};

//for test
export const tableScan = async (req, res, next) => {
  console.log('table NAME : ', TABLE_NAME);
  try {
    const params = {
      TableName: TABLE_NAME,
    };
    const response = await dynamoDb.scan(params).promise();
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    next(e);
  }
};
