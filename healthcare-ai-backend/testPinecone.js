require('dotenv').config();
const pinecone = require("./config/pinecone");

async function test() {
  try {
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

    console.log("Pinecone Connected Successfully");
    console.log(index);

  } catch (err) {
    console.error(err);
  }
}

test();
