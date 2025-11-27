const https = require('https');
const fs = require('fs').promises;
const path = require('path');

/**
 * Script to download and simplify Niedersachsen GeoJSON
 * Source: deutschlandGeoJSON repository
 */

const GEOJSON_URL = 'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/4_niedrig.geo.json';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'maps');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'niedersachsen.geojson');

/**
 * Download file from URL
 */
function downloadFile(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

/**
 * Simplify GeoJSON by reducing coordinate precision
 * This reduces file size while maintaining visual accuracy
 */
function simplifyGeoJSON(geojson) {
  const data = JSON.parse(geojson);
  
  // Find Niedersachsen feature
  const niedersachsen = data.features.find(
    feature => feature.properties.name === 'Niedersachsen' || 
               feature.properties.GEN === 'Niedersachsen'
  );

  if (!niedersachsen) {
    throw new Error('Niedersachsen feature not found in GeoJSON');
  }

  // Round coordinates to reduce file size
  function roundCoordinates(coords, precision = 4) {
    if (typeof coords[0] === 'number') {
      return coords.map(c => parseFloat(c.toFixed(precision)));
    }
    return coords.map(c => roundCoordinates(c, precision));
  }

  if (niedersachsen.geometry.coordinates) {
    niedersachsen.geometry.coordinates = roundCoordinates(niedersachsen.geometry.coordinates);
  }

  // Return only Niedersachsen as a FeatureCollection
  return {
    type: 'FeatureCollection',
    features: [niedersachsen]
  };
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('📥 Downloading Niedersachsen GeoJSON...');
    const geojsonData = await downloadFile(GEOJSON_URL);
    
    console.log('🔧 Simplifying GeoJSON...');
    const simplified = simplifyGeoJSON(geojsonData);
    
    console.log('📁 Creating output directory...');
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    console.log('💾 Saving to file...');
    await fs.writeFile(
      OUTPUT_FILE,
      JSON.stringify(simplified, null, 2),
      'utf8'
    );
    
    const stats = await fs.stat(OUTPUT_FILE);
    console.log(`✅ Success! File saved to: ${OUTPUT_FILE}`);
    console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();



