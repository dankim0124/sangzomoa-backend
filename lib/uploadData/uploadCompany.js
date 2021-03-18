import path from 'path';

import fs from 'fs';

import { delay } from "../delay";
import { putItem_ } from '../dynamoDB';

const uploadJSON = async (req, res, next) => {
  try {
    const itemResult = [];

    // #1 : 아이템 정보 임포트
    const __dirname = path.resolve();
    const itemPath = path.join(__dirname, '/jsons/f2.json');
    const itemData = await fs.promises.readFile(itemPath);
    const itemJSON = JSON.parse(itemData.toString());

    // #2 : 식장 정보 임포트
    const funeralPath = path.join(__dirname, '/jsons/funeralJSON.json');
    const funeralData = await fs.promises.readFile(funeralPath);
    let funeralJSON = JSON.parse(funeralData.toString());
    funeralJSON = funeralJSON.table;

    // #3 식장 정보 SK값 생성/기록
    // #4 데이터 정리 위한 해쉬 생성
    const funeralSet = new Set();
    const funeralLength = funeralJSON.length;
    const duplicate = new Set();
    const funeralHash = {};

    for (let i = 0; i < funeralLength; i++) {
      const item = funeralJSON[i];
      const itemName = item['시설명'];
      if (funeralSet.has(itemName)) {
        //   throw Error(`이미 존재하는 SK 값입니다 : ${SK}`);
        duplicate.add(itemName);
      } else {
        funeralSet.add(itemName);
        funeralHash[item['시설명']] = i;

        funeralJSON[i] = {
          ...funeralJSON[i],
          SK: itemName + '_' + item['전화번호'],
          PK: 'funeralCompany',
          services: [],
        };
        //   await putItemWithDelay(funeralJSON[i]);
      }
    }

    // #4 item -> 식사, 시설 임대료 제외 걷어내기
    // #5 itemSK 설정
    // #6 itemSK 를 funeral에 리스트로 기록
    //.... 위의 과정 중, duplicate 에 있는 것은 생략.

    const itemLength = itemJSON.length;
    for (let i = 0; i < itemLength; i++) {
      const item = itemJSON[i];
      // 이름이 겹치는 장례식장 정보는 보류
      if (duplicate.has(item['장례식장명칭'])) {
        continue;
      }

      // item 은 시설임대, 식사 이외는 제외 ...... 상조가 커버 못하는 것.
      if (item['항목'] != '시설임대료' && item['항목'] != '식사') {
        continue;
      }
      const funeralIndex = funeralHash[item['장례식장명칭']];
      // item의 SK, PK, 소속 추가.
      const newItem = {
        ...item,
        SK: item['장례식장명칭'] + '_' + item['품명'] + item['규격'],
        PK: 'funeralItem',
        funeral: funeralJSON[funeralIndex]['SK'],
      };

      // 해당 funeral의 services 에 추가.
      funeralJSON[funeralIndex]['services'].push(newItem['SK']);
      itemResult.push(newItem);
    }
    //    console.log(itemResult);
    for (const item of itemResult) {
      await putItemWithDelay(item);
    }
    for (const item of funeralJSON) {
      await putItemWithDelay(item);
    }
    res.status(200).send({ duplicate });
  } catch (e) {
    next(e);
  }
};

const putItemWithDelay = async (item) => {
  await putItem_(item);
  await delay(400);
};

export default uploadJSON;
