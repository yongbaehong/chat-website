import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import faker from 'faker';
import Communities from '../resources/communities/communities.model';
import User from '../resources/user/user.model';
import copyFile from './copyFile';

const dataDir = path.resolve(__dirname, '../', 'public');
const userPhotosDir = path.join(dataDir, 'user-photos');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(userPhotosDir)) fs.mkdirSync(userPhotosDir);
const mkdir = promisify(fs.mkdir);

const peopleSeed = ['Jennifer', 'Lauren', 'Jasmine', 'Michelle', 'Sarah', 'Ester', 'Grace', 'Ruth', 'David', 'Adam', 'Joseph', 'Mark', 'Luke'];
const communitySeed = ['Gamers', 'Coding Bootcamp', 'Movie Buffs', 'Train Enthusiast', 'Sail Boats', 'Crochet Masters', 'Hikers Camp', 'Video Art', 'Anime Watchers', 'Music Festival', 'Greener World', 'Book Worms']
const seedData = async () => {
  try {
    const findFile = dataDir.slice(0, -12);
    // copy logo picture to dist
    await copyFile(`${findFile}/public/Logo3.png`, `${dataDir}/Logo3.png`);
    await copyFile(`${findFile}/public/Dm.svg`, `${dataDir}/Dm.svg`);
    await copyFile(`${findFile}/public/default-avatar.svg`, `${dataDir}/default-avatar.svg`);
    await copyFile(`${findFile}/public/whoops.svg`, `${dataDir}/whoops.svg`);
    await copyFile(`${findFile}/public/commune5.svg`, `${dataDir}/commune5.svg`);
    for (let i = 0; i < peopleSeed.length; i += 1) {
      const user = await User.create({
        username: peopleSeed[i], password: peopleSeed[i].toLowerCase(), gender: `${(i < 8 ? 'female' : 'male')}`, age: Math.floor(Math.random() * 10) + 25, avatar: `${peopleSeed[i]}.jpeg`,
      });
      if (!user) continue;
      const dir = `${userPhotosDir}/${user._id}`;
      await mkdir(dir);
      await copyFile(`${findFile}/public/${peopleSeed[i]}.jpeg`, `${dir}/${peopleSeed[i]}.jpeg`);
    }
    console.log('Users seeded. 📥');

    for (let i = 0; i < communitySeed.length; i += 1) {
      const communes = await Communities.create({
        name: communitySeed[i],
        address: {
          street: faker.address.streetAddress(),
          city: faker.address.city(),
          stateAbbr: faker.address.stateAbbr(),
          zipCode: faker.address.zipCode(),
        },
      });
      if (!communes) continue;
    }
    console.log('Communities seeded. 📥');
  } catch (err) {
    console.log('Error seeding data...❌', err);
    return err;
  }
};

export default seedData;
