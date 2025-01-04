
// ChatGPT の出力結果を修正して利用

/**
 * Convert GeoJSON vertices to include [x, y, z] and flatten multi-part geometries.
 * @param {Object} geojson - Input GeoJSON object.
 * @param {Function} getElev - Function to get elevation: getElev(x, y, option).
 * @param {Object} [option] - Optional parameter to pass to getElev.
 * @returns {Promise<Object>} - A promise resolving to the updated GeoJSON object.
 */
async function addZToGeoJSON(geojson, getElev, option = {}) {


  // Helper function to process coordinates
  const processCoordinates = async (coords, props) => {
    if (Array.isArray(coords[0])) {
      // Recursive case for nested arrays
      return Promise.all(coords.map( c => processCoordinates(c, props) ));
    } else {
      // Base case: [x, y] 
      const [x, y] = coords;
      const z = option.propZ && props[option.propZ] ? props[option.propZ] : await getElev([x, y], option);
      return [x, y, z];
    }
  };

  // Helper function to flatten multi-part geometries
  const flattenGeometry = (geometry) => {
    switch (geometry.type) {
      case "MultiPoint":
        return geometry.coordinates.map((coords) => ({
          type: "Point",
          coordinates: coords,
        }));
      case "MultiLineString":
        return geometry.coordinates.map((coords) => ({
          type: "LineString",
          coordinates: coords,
        }));
      case "MultiPolygon":
        return geometry.coordinates.map((coords) => ({
          type: "Polygon",
          coordinates: coords,
        }));
      default:
        return [geometry];
    }
  };

  // Extract and process features
  const features = [];
  for (const feature of geojson.features) {
    const { geometry, properties } = feature;
    const flattenedGeometries = flattenGeometry(geometry);
    for (const geom of flattenedGeometries) {
      const updatedCoordinates = await processCoordinates(geom.coordinates, properties);
      features.push({
        type: "Feature",
        geometry: { type: geom.type, coordinates: updatedCoordinates },
        properties: { ...properties },
      });
    }
  }

  // Return the new GeoJSON
  //console.log(features);
  return {
    type: "FeatureCollection",
    features: features,
  };
}

async function addZPropToGeoJSON(geojson, getElev, option = {}) {
  // Helper function to process coordinates
  const processCoordinates = async (feature, props) => {
    const [x, y] = turf.center(feature).geometry.coordinates; // 代表点を返す
    const z = option.propZ && props[option.propZ] ? props[option.propZ] : await getElev([x, y], option);
    return z;
  };

  // Helper function to flatten multi-part geometries
  const flattenGeometry = (geometry) => {
    switch (geometry.type) {
      case "MultiPoint":
        return geometry.coordinates.map((coords) => ({
          type: "Point",
          coordinates: coords,
        }));
      case "MultiLineString":
        return geometry.coordinates.map((coords) => ({
          type: "LineString",
          coordinates: coords,
        }));
      case "MultiPolygon":
        return geometry.coordinates.map((coords) => ({
          type: "Polygon",
          coordinates: coords,
        }));
      default:
        return [geometry];
    }
  };

  // Extract and process features
  const features = [];
  for (const feature of geojson.features) {
    const { geometry, properties } = feature;
    const flattenedGeometries = flattenGeometry(geometry);
    for (const geom of flattenedGeometries) {
      const zValue = await processCoordinates(feature, properties); // feature を渡す
      features.push({
        type: "Feature",
        geometry: geom,
        properties: { ...properties, alti: zValue },
      });
    }
  }

  // Return the new GeoJSON
  console.log(features);
  return {
    type: "FeatureCollection",
    features: features,
  };
}


