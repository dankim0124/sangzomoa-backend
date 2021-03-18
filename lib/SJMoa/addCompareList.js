import { getItemBySK_, updateItem_ } from '../dynamoDB';

const addCompareList = async (req, res, next) => {
  try {
    const { productSK, email, type } = req.body;
    let user = await getItemBySK_('user', email);

    let selected = user.Items[0].selected;

    if (type == 'funeralService') {
      const selectedService = selected['비교하기']['상조상품'];
      if (selectedService.includes(productSK)) {
      } else {
        selectedService.push(productSK);
      }
    } else if (type == 'funeralCompany') {
      const selectedService = selected['비교하기']['장례식장'];
      if (selectedService.includes(productSK)) {
      } else {
        selectedService.push(productSK);
      }
    }
    await updateItem_('user', email, 'selected', selected);
    res.status(200).send({ success: true });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export default addCompareList;
