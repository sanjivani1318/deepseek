const { MongoClient } = require('mongodb');

// MongoDB URI (local or cloud)
const uri = "mongodb+srv://greatstack:greatstack123@cluster0.wbltn7z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


async function testConnection() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ MongoDB connection established successfully!");

        const databasesList = await client.db().admin().listDatabases();
        console.log("Available Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
    } finally {
        await client.close();
    }
}

testConnection();