import mongoose from 'mongoose';
import seedData from './seedData';

const dbURL = 'mongodb://localhost/hong-grad';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
mongoose.connection.on('error', async (err) => {
  if (err) {
    throw err;
  }
});

const connectDatabase = async () => {
  try {
    await db.once('open', async () => {
      console.log('Grad-Project connect to mongodb ✅');
      await db.dropDatabase();
      await seedData();
    });
  } catch (err) {
    console.log('connectDatabase Error'.red);
  }
};

export default connectDatabase;
