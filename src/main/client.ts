import { MongoClient, ServerApiVersion } from "mongodb";
export default class Client extends MongoClient {
  constructor(uri: string) {
    super(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    })
  }
}