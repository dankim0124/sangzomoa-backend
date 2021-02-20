import AWS from 'aws-sdk';

export const kakaoLogin = async (req, res, next) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
  });

  const testEmail = '997998@naver.com';
  const Username = testEmail;
  const GroupName = 'kakao';
  const UserPoolId = `ap-northeast-2_okzpHKkv3`;
  const ClientId = `36e3stnob0bniltpj9bkgrrbnk`;
  const Password = '@Aa12345';
  const newUserParam = {
    ClientId,
    Username: testEmail,
    Password: Password,
    ClientMetadata: {
      UserPoolId,
      Username,
      GroupName,
    },
    UserAttributes: [
      {
        Name: 'email' /* required */,
        Value: testEmail,
      },
      {
        Name: 'name' /* required */,
        Value: testEmail,
      },
    ],
  };
  try {
    const result = await cognitoidentityserviceprovider.signUp(newUserParam).promise();
    res.status(200).send(result);
  } catch (e) {
    if (e.code == 'UsernameExistsException') {
      res.status(200).send({ status: 'existAccount' });
    } else {
      console.log(e);
      next(e);
    }
  }
};
