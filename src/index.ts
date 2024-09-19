import Client from "./main/client.js";
import api from "./main/api.js";

const uri = process.env.MONGO_URI || "";
if (!uri) process.exit(1);

const client = new Client(uri)

async function run() {
  try {
    await client.connect();
    await client.db("main").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("main");
    
    await api(database)
  } catch {
    console.log
  }
}
run().catch(console.dir);

;