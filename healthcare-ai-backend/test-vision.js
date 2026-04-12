// test-vision.js
// Simple test for Google Vision API integration
require('dotenv').config();
const vision = require('@google-cloud/vision');

async function testVision() {
  try {
    const client = new vision.ImageAnnotatorClient();
    // Use a sample image from the web
    const [result] = await client.labelDetection({
      image: {source: {imageUri: 'https://cloud.google.com/vision/docs/images/logo.png'}},
    });
    const labels = result.labelAnnotations;
    console.log('Labels detected:');
    labels.forEach(label => console.log(label.description));
    console.log('Google Vision API integration: SUCCESS');
  } catch (err) {
    console.error('Google Vision API integration: FAILED');
    console.error(err.message);
    process.exit(1);
  }
}

testVision();
