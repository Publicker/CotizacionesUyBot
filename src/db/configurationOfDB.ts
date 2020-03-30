import mongoose from 'mongoose';

export async function connectToDB(MONGOURI: string) {
  mongoose.set('useCreateIndex', true);

  await mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
