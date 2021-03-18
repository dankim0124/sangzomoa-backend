import AWS from 'aws-sdk';
import { putItem_ } from './dynamoDB';

export const kakaoLogin = async (req, res, next) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
  });
  const { email, id } = req.body;
  const testEmail = '997998@naver.com';
  const Username = testEmail;
  const GroupName = 'kakao';
  const UserPoolId = `ap-northeast-2_okzpHKkv3`;
  const ClientId = `36e3stnob0bniltpj9bkgrrbnk`;
  const Password = '@Aa12345';
  console.log('request KAKAO LOGIN ');
  console.log('params : ', req.body);

  const newUserParam = {
    ClientId,
    Password: Password,
    Username: email,
    ClientMetadata: {
      UserPoolId,
      Username,
      GroupName,
    },
    UserAttributes: [
      {
        Name: 'email' /* required */,
        Value: email,
      },
      {
        Name: 'name' /* required */,
        Value: email,
      },
    ],
  };

  try {
    const result = await cognitoidentityserviceprovider.signUp(newUserParam).promise();
    console.log('success: new user');
    const date = new Date().toISOString();
    const userParam = {
      PK: 'user',
      SK: email,
      email: email,
      id: id,
      created: date,
      selected: {
        비교하기: {
          상조상품: [],
          장례식장:[],
          화장터: [],
          장지: [],
        },

        구매예정: {
          화장터: null,
          장례식장:null,
          장지: null,
          상조상품: null,
        },
      },

      rate: [],
    };
    await putItem_(userParam);
    res.status(200).send(result);
  } catch (e) {
    if (e.code == 'UsernameExistsException') {
      console.log('user already exist');
      res.status(200).send({ status: 'existAccount' });
    } else {
      console.log(e);
      next(e);
    }
  }
};

