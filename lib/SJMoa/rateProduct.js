import { getItemBySK_, updateItem_ } from '../dynamoDB';

const rateProduct = async (req, res, next) => {
  let { rate, productSK, email } = req.body;
  rate = Number(rate);

  try {
    let service = await getItemBySK_('funeralSevice', productSK);
    let user = await getItemBySK_('user', email);

    service = service.Items[0];
    user = user.Items[0];

    //중복 평가 하면 마지막 평가로 덮어 쓰기.
    const idx = userHasRated(user, productSK);
    // update product data
    if (idx == -1) {
      const totalRate = Number(service.totalRate) || 0;
      const rateCount = Number(service.rateCount) || 0;
      await updateItem_('funeralSevice', productSK, 'totalRate', totalRate + rate);
      await updateItem_('funeralSevice', productSK, 'rateCount', rateCount + 1);
    } else {
      const duplicatedRate = user.rate[idx];
      console.log('DR[productSK] : ', duplicatedRate);

      const totalRate = Number(service.totalRate);
      await updateItem_('funeralSevice', productSK, 'totalRate', totalRate + rate - duplicatedRate[productSK]);
    }

    // update userData
    if (idx == -1) {
      const rateList = user.rate;
      const newRate = {};
      newRate[`${productSK}`] = rate;
      rateList.push(newRate);
      await updateItem_('user', email, 'rate', rateList);
    } else {
      const rateList = user.rate;
      const newRate = {};
      newRate[`${productSK}`] = rate;
      rateList.splice(idx, 1, newRate);
      await updateItem_('user', email, 'rate', rateList);
    }

    res.status(200).send('success');
  } catch (e) {
    console.log(e);
    next(e);
  }
};

const userHasRated = (user, productSK) => {
  const rateList = user.rate;
  const idx = rateList.findIndex((item) => {
    return item[`${productSK}`] !=undefined;
  });
  return idx;
};


export default rateProduct;
