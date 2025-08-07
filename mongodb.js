const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function run() {
    try {
        
        await client.connect();

       
        const db = client.db('testdb');

        
        const collection = db.collection('users');

       
        const result = await collection.insertOne({ name: "John Doe", age: 30 });
        console.log(`Document inserted with _id: ${result.insertedId}`);
    } finally {
        
        await client.close();
    }
}

run().catch(console.error);