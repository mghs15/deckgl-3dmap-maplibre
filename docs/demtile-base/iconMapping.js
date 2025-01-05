const showIcon = (code) => {
  if(!code) return null;
  let iconname = "unknown";
  switch(+code){
    case 1401:
      iconname = "都道府県所在地-20"; break;
    case 1402:
      iconname = "市役所・東京都の区役所-20"; break;
    case 1403:
      iconname = "町村役場・政令指定都市の区役所-20"; break;
    case 3201:
      iconname = "官公署"; break;
    case 3202:
      iconname = "裁判所"; break;
    case 3205:
      iconname = "市役所・東京都の区役所"; break;
    case 3206:
      iconname = "町村役場・政令指定都市の区役所"; break;
    case 3211:
      iconname = "交番"; break;
    case 3212:
      iconname = "高等学校・中等教育学校"; break;
    case 3214:
      iconname = "小学校"; break;
    case 3213:
      iconname = "中学校"; break;
    case 3214:
      iconname = "小学校"; break;
    case 3215:
      iconname = "老人ホーム"; break;
    case 3216:
      iconname = "博物館法の登録博物館・博物館相当施設"; break;
    case 3217:
      iconname = "図書館"; break;
    case 3218:
      iconname = "郵便局"; break;
    case 3221:
      iconname = "灯台"; break;
    case 3231:
      iconname = "神社"; break;
    case 3232:
      iconname = "寺院"; break;
    case 3241:
      iconname = "警察署"; break;
    case 3242:
      iconname = "消防署"; break;
    case 3243:
      iconname = "病院"; break;
    case 3244:
      iconname = "保健所"; break;
    case 4101:
      iconname = "煙突"; break;
    case 4102:
      iconname = "風車"; break;
    case 4103:
      iconname = "油井・ガス井"; break;
    case 4104:
      iconname = "記念碑"; break;
    case 4105:
      iconname = "自然災害伝承碑"; break;
    case 6301:
      iconname = "墓地"; break;
    case 6311:
      iconname = "田"; break;
    case 6312:
      iconname = "畑"; break;
    case 6313:
      iconname = "茶畑"; break;
    case 6314:
      iconname = "果樹園"; break;
    case 6321:
      iconname = "広葉樹林"; break;
    case 6322:
      iconname = "針葉樹林"; break;
    case 6323:
      iconname = "竹林"; break;
    case 6324:
      iconname = "ヤシ科樹林"; break;
    case 6325:
      iconname = "ハイマツ地"; break;
    case 6326:
      iconname = "笹地"; break;
    case 6327:
      iconname = "荒地"; break;
    case 6331:
      iconname = "温泉"; break;
    case 6332:
      iconname = "噴火口・噴気口"; break;
    case 6341:
      iconname = "史跡・名勝・天然記念物"; break;
    case 6342:
      iconname = "城跡"; break;
    case 6351:
      iconname = "採鉱地"; break;
    case 6361:
      iconname = "港湾"; break;
    case 6362:
      iconname = "漁港"; break;
    case 6367:
      iconname = "特定重要港-20"; break;
    case 6368:
      iconname = "重要港-20"; break;
    case 6371:
      iconname = "国際空港-20"; break;
    case 6372:
      iconname = "自衛隊等の飛行場-20"; break;
    case 6375:
      iconname = "国際空港-20"; break;
    case 6376:
      iconname = "国際空港以外の拠点空港等-20"; break;
    case 6381:
      iconname = "自衛隊-20"; break;
    case 7102:
      iconname = "三角点"; break;
    case 7103:
      iconname = "水準点"; break;
    case 7101:
      iconname = "電子基準点"; break;
    case 7221:
      iconname = "火山-20"; break;
//    case 7601:
//      iconname = "砂礫地（領域が不明瞭な場合）-20"; break;
    case 8103:
      iconname = "発電所等"; break;
    case 8105:
      iconname = "電波塔"; break;
    case 51301:
      iconname = "人口100万人以上-500"; break;
    case 51302:
      iconname = "人口50万-100万人未満-500"; break;
    case 51303:
      iconname = "人口50万人未満-500"; break;
    case 56368:
      iconname = "主要な港-500"; break;
    case 56376:
      iconname = "主要な空港-500"; break;
    default:
      iconname = "指示点"; break;
  }

  return iconname;
}