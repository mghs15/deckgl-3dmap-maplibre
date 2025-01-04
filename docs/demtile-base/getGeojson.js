
function getGeojson(geom_type, source_layer, source, zl, filter){
  
  const isStyleLoaded = map.isStyleLoaded();
  if(!isStyleLoaded) return;
  
  const queryOption = {sourceLayer: source_layer,};
  if(filter) queryOption.filter = filter;
  
  const geojson = {
    type: "FeatureCollection",
    features: map.querySourceFeatures(source, queryOption)
  };
  console.log(geojson);
  
  if(geom_type == "LineStringWithZ"){
    let outputOption = { 
      zl:zl, propZ: "vt_alti" 
    };
    
    return addZToGeoJSON(geojson, getElevTileValue, outputOption)
    .then( collection => {
      return Promise.resolve(collection.features);
    });
    
  } else if(geom_type == "LineString"){
    let outputOption = { 
      zl:zl
    };
    
    return addZToGeoJSON(geojson, getElevTileValue, outputOption)
    .then( collection => {
      return Promise.resolve(collection.features);
    });
    
  }else if(geom_type == "Polygon"){
    let outputOption = { 
      zl:zl, propZ: "vt_alti" 
    };
    
    return addZPropToGeoJSON(geojson, getElevTileValue, outputOption)
    .then( collection => {
      return Promise.resolve(collection); // これはGeoJSONのまま返す
    });
  }
  
}


/*************************************************/
/*標高 関係設定                                  */
/*************************************************/

function getElevTileValue(cn, option){
  const pow2_8 = Math.pow(2, 8);
  const pow2_16 = Math.pow(2, 16);
  const pow2_23 = Math.pow(2, 23);
  const pow2_24 = Math.pow(2, 24);
     
  // データの取得・表示
  return getRasterTilePixel(cn, option)
  .then(({r, g, b}) => {
  
    let h = 0;

    if (r != 128 || g != 0 || b != 0) {
      const d = r * pow2_16 + g * pow2_8 + b;
      h = (d < pow2_23) ? d : d - pow2_24;
      if (h == -pow2_23) h = 0;
      else h *= 0.01;
      h = Math.floor(h * 100)/100;
    }else {
      // h = 0;
    }
    
    // OK: console.log(r, g, b, h);
  
    return Promise.resolve(h);
    
  })
  .catch((err) => {
    console.error(err);
    return Promise.resolve(h);
  });
}

const getRasterTilePixel = (
  pt, // [lng, lat]
  option={}
) => {

  const zl = option.zl && option.zl < 15 ? option.zl : 14;
  const tileUrl = option.tileUrl || "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png";
   
  /*
  return new Promise((resolve, reject) => {
    console.log(zl);
    resolve({r:0, g:255*Math.random(), b:255*Math.random()});
  });
  */
     
  //Reference: Slippy map tilenames
  //https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
  const lon2tile = (lon,zoom) => { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
  const lat2tile = (lat,zoom) => { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
  const lon2tiled = (lon,zoom) => { return ((lon+180)/360*Math.pow(2,zoom)); }
  const lat2tiled = (lat,zoom) => { return ((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)); }

  // pt = [<number>, <number>]
  const xd = lon2tiled(pt[0], zl);
  const yd = lat2tiled(pt[1], zl);
  
  const tilePos = {"x": xd, "y": yd};

  const y = Math.floor(tilePos.y);
  const pY = Math.floor((tilePos.y - y) * 256);
  
  const x = Math.floor(tilePos.x);
  const pX = Math.floor((tilePos.x - x) * 256);
  
  const img = new Image(); 
  img.crossOrigin = "Anonymous";
  img.src = tileUrl.replace(/\{z\}/, zl).replace(/\{x\}/, x).replace(/\{y\}/, y);
  
  return new Promise((resolve, reject) => {
    
    img.onload = () => {
    
      const _canvas = document.createElement("canvas");
      _canvas.width = option.width || 256;
      _canvas.height = option.heght || 256;
      
      const ctx = _canvas.getContext("2d");

      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, 256, 256);
      const idx = (pY * 256 * 4) + (pX * 4);
      const r = imgData.data[idx + 0];
      const g = imgData.data[idx + 1];
      const b = imgData.data[idx + 2];
      
      resolve({r:r, g:g, b:b});
      
    }
    
    img.onerror = () => {
    
      reject(
        new Error('タイルの取得に失敗しました')
      );
      
    }
    
  });
    
}
