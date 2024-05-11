
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';


class MongoDB {
    /**
     * constructor
     * Loads a .env, initializes a MongoDB connection URL using environment variables,
     * and sets up properties for the MongoDB client and database
     */
    

    constructor() {
        dotenv.config();
        const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
        this.mongoURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
        this.client;
        this.db;
      }

    /**
     * Opens a connection to the MongoDB database
     */

    async connect() {
        try {
            this.client = new MongoClient(this.mongoURL);
            await this.client.connect();
            this.db = this.client.db();
            console.log('Connected to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Closes the connection to the MongoDB database.
     */

    async close() {
        try {
            await this.client.close();

            console.log('Closed connection to MongoDB');
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Creates a new document in the specified collection
     * @param {string} collectionName - the name of the collection
     * @param {Object} data - the data to be inserted into the collection
     * @returns {Promise<Object>} - a Promise that resolves with the acknoledgement document
     */

    async create(collectionName, data) {
        try {
          const result = await this.db.collection(collectionName).insertOne(data);
          return result;
        } catch (err) {
          console.error("Error inserting document:", err);
          throw err; // Rethrow the error to be caught by the caller
        }
      }
    
    /**
     * Finds documents by their _id in the specified collection
     * @param {string} collectionName - the name of the collection
     * @param {string} _id - the _id of the document to find
     * @returns {Promise<Cursor>} - a Promise that resolves with the cursor
     */

    async checkCollection(collectionName)
    {
        try {
            const result = await this.db.collection(collectionName);
            return result;
          } catch (err) {
            console.error("Error finding document:", err);
          }
    }

    async findID(collectionName, _id) {
        try {
          const projection = { _id: 0 };
          const result = await this.db.collection(collectionName).findOne({_id}, {projection});
          return result;
        } catch (err) {
          console.error("Error finding document:", err);
        }
      }
    async findData(collectionName, data) {
        try {
            const projection = { _id: 0 };
            const result = await this.db.collection(collectionName).findOne({searchTerm: data}, {projection});
            return result;
        } catch (err) {
            console.error("Error finding document:", err);
        }
    }  
    async returnAllData(collectionName) {
        try {
            const projection = { _id: 0 };
            const collection = this.db.collection(collectionName);
            return await collection
                  .find({}, {projection})
                  .limit(100)
                  .sort({ _id: -1 })
                  .toArray();
        } catch (err) {
            console.error("Error finding document:", err);
        }

    }    
    async update(collectionName, previous, update) {
        try {

          const filter = { previous };
          const replacement = { $set: update };

        await this.db.collection(collectionName).updateOne (filter, replacement);
        //return result;
        } catch (err) {
        console.error("Error finding document:", err);
        }
    }    
}
export default new MongoDB();
