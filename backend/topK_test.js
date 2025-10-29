require('dotenv').config({ path: './.env' }); 

const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index('show-js').namespace("example-namespace");; 

async function textSearch(queryText, topK = 20) {
  try {
    const results = await index.searchRecords({
      query: {
        topK: topK,
        inputs: {text: queryText},
        },
    });

    // Cleanly access the results
    console.log(`Found ${results.result.hits.length} matches for "${queryText}":`);
    results.result.hits.forEach(hit => {
      console.log(`  - ID: ${hit._id}, Score: ${hit._score.toFixed(4)}, Title: ${hit.fields.title}`);
    });

    return results.result.hits;

  } catch (error) {
    console.error('Error during Pinecone search:', error);
    throw error; 
  }
}

// Example usage
textSearch('Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night\'s Watch, is all that stands between the realms of men and icy horrors beyond.', 10);