import AWS from 'aws-sdk';

const testFunc = (req, res, next) => {
  try {
    const tt = new AWS.Credentials();
    const ttt = tt.accessKeyId;
    console.log('tt', tt);
    console.log('access key ', ttt);
    console.log(req);

    res.status(200).send({ success: true });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export default testFunc;
