
//最初にロードしたスタイルをベースに解析を行う。
var getGeojson = function(geomtype, source_layer, source){
  /* スタイルの確認 */
  var styleLoadStatus = map.isStyleLoaded();
  if(styleLoadStatus){
  
    var all_features = [];
    var all_features3d = [];
    
    var pow2_8 = Math.pow(2, 8);
    var pow2_16 = Math.pow(2, 16);
    var pow2_23 = Math.pow(2, 23);
    var pow2_24 = Math.pow(2, 24);
    
    var contour = map.querySourceFeatures(source, {
        sourceLayer: "Cntr",
        //filter: ["in", ["get", "vt_code"], ["literal", [7351, 7352, 7353]] ] //等深線を除く
        // 最適化ベクトルタイルの場合、等深線は Isbt レイヤへ分離
    });
   
    if(source_layer == "Cntr"){
        
        var feature3d = [];
        
        var features = contour;
        
        for(j in features){
            
            var f = features[j];
            
            /*
            if(f.geometry.type != "LineString"){
                continue;
            }
            */
            
            var g = [];
            
            if(f.geometry.type == "LineString"){
            
            //LineStirngの場合
              for(k in f.geometry.coordinates){
                  var lon = f.geometry.coordinates[k][0];
                  var lat = f.geometry.coordinates[k][1];
                  g.push([f.geometry.coordinates[k][0], f.geometry.coordinates[k][1], f.properties["vt_alti"]]);
              }
              
              feature3d.push({
                "path": g,
                "sourceLayer": "contour",
                "properties": f.properties
              });
              
            }else if(f.geometry.type == "MultiLineString"){
            
            //MultiLineStringの場合
              for(l in f.geometry.coordinates){
                for(k in f.geometry.coordinates[l]){
                    var lon = f.geometry.coordinates[l][k][0];
                    var lat = f.geometry.coordinates[l][k][1];
                    g.push([f.geometry.coordinates[l][k][0], f.geometry.coordinates[l][k][1], f.properties["vt_alti"]]);
                }
                
                feature3d.push({
                  "path": g,
                  "sourceLayer": "contour",
                  "properties": f.properties
                });
              }
              
            }else{
              continue;
            }
        }
        
        all_features = all_features.concat(features);
        all_features3d = all_features3d.concat(feature3d);
    
    }else if(geomtype == "Polygon"){
           
        var features = map.querySourceFeatures(source, {
               sourceLayer: source_layer
        });
        
        //contourデータを簡略化の上、すべてポイントにして処理する。
        var collection = turf.featureCollection(contour);
        var contourPointsOriginal = turf.explode(collection);
        console.log("原データ：" + contourPointsOriginal.features.length);
        var collection = turf.simplify(collection, {tolerance: 0.5});
        var contourPoints = turf.explode(collection);
        console.log("簡略データ：" + contourPoints.features.length);
        
        var feature3d = [];
        
        for(j in features){
            
            var f = features[j];
            
            if(f.geometry.type != "Polygon" && f.geometry.type != "MultiPolygon"){
                continue;
            }
            
            var targetPoint = turf.centerOfMass(f);
            var nearestPoint = turf.nearestPoint(targetPoint, contourPoints);
            
            features[j].properties["alti"] = nearestPoint.properties["vt_alti"];
            
            feature3d.push({
              "polygon": f.geometry.coordinates,
              "sourceLayer": source_layer,
              "properties": features[j].properties //altiをもとのObjectにも加えるため。
            });
        }
        
        all_features = all_features.concat(features);
        all_features3d = all_features3d.concat(feature3d);
      
    }else if(geomtype == "LineString"){
        
        var features = map.querySourceFeatures(source, {
               sourceLayer: source_layer
        });
        
        //contourデータを簡略化の上、すべてポイントにして処理する。
        var collection = turf.featureCollection(contour);
        var contourPointsOriginal = turf.explode(collection);
        console.log("原データ：" + contourPointsOriginal.features.length);
        var collection = turf.simplify(collection, {tolerance: 0.5});
        var contourPoints = turf.explode(collection);
        console.log("簡略データ：" + contourPoints.features.length);
        
        var feature3d = [];
        
        for(j in features){
            
            var f = features[j];
            
            /*
            if(f.geometry.type != "LineString" && f.geometry.type != "MultiLineString"){
                continue;
            }
            */
            var g = [];
            
            
            if(f.geometry.type == "LineString"){
            
            //LineStirngの場合
              for(k in f.geometry.coordinates){
                  
                  var lon = f.geometry.coordinates[k][0];
                  var lat = f.geometry.coordinates[k][1];
                  
                  var targetPoint = turf.point([f.geometry.coordinates[k][0], f.geometry.coordinates[k][1]]);
                  var nearestPoint = turf.nearestPoint(targetPoint, contourPoints);
                  
                  g.push([f.geometry.coordinates[k][0], f.geometry.coordinates[k][1], nearestPoint.properties["vt_alti"]]);
                  
              }
              
              feature3d.push({
                "path": g,
                "sourceLayer": source_layer,
                "properties": f.properties
              });
            }else if(f.geometry.type == "MultiLineString"){
            
            //MultiLineStirngの場合
              
              for(l in f.geometry.coordinates){
                for(k in f.geometry.coordinates[l]){
                    
                    var lon = f.geometry.coordinates[l][k][0];
                    var lat = f.geometry.coordinates[l][k][1];
                    
                    var targetPoint = turf.point([f.geometry.coordinates[l][k][0], f.geometry.coordinates[l][k][1]]);
                    var nearestPoint = turf.nearestPoint(targetPoint, contourPoints);
                    
                    g.push([f.geometry.coordinates[l][k][0], f.geometry.coordinates[l][k][1], nearestPoint.properties["vt_alti"]]);
                    
                }
                
                feature3d.push({
                  "path": g,
                  "sourceLayer": source_layer,
                  "properties": f.properties
                });
                
              }
            }else{
              continue;
            }
        }
        
        all_features = all_features.concat(features);
        all_features3d = all_features3d.concat(feature3d);
    }
    
    var geojson = {
      "type": "FeatureCollection",
      "features": all_features
    };
    
    var results = {
      "geom-type": geomtype,
      "source-layer": source_layer,
      "contents3d": all_features3d,
      "geojson": geojson
    };
    
    console.log(results);
    
    return results;
    
  }else{
    alert("まだ地図のスタイルを読み込めていません！");
  }
}