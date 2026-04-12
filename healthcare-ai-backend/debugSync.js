require("dotenv").config();
const pinecone = require("./config/pinecone");

async function debug() {
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    
    // Pass as an object { records: [...] }
    try {
        await index.upsert({ records: [ { id: "test_array", values: Array.from({length: 384}, () => 0.1) } ] }); 
        console.log("Upsert with {records:[]} successful!");
    } catch(err) {
        console.error("Upsert with {records:[]} failed", err.message);
    }
}
debug()
