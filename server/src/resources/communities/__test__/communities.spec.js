import mongoose from 'mongoose';
import request from 'supertest';
import { socketServer } from '../../../server';

describe('API TEST: User CONTROLLERS', () => {
  let user, crudId;

  beforeAll(async () => {
    try {
      user = await request(socketServer)
        .post('/login')
        .send({ username: 'Mark', password: 'Mark' });

      // save sessions  
      sessions = user
        .headers['set-cookie'][0]
        .split(',')
        .map(item => item.split(';')[0])
        .join(';');
    } catch (err) {
      return err
    }
  });


  afterAll(() => {
    mongoose.disconnect();
  });


  test('1.) /api/communities/all' + ' Get all community chats.', async () => {
    expect.assertions(1)

    const allCommChats = await request(socketServer)
      .get('/api/communities/all')

    let chatLength = allCommChats.body.communes.length;
    expect(allCommChats.body.communes).toHaveLength(chatLength)
  });

  test('2.) /api/communities/' + ' POST: create a new Community Chat Document.', async () => {
    expect.assertions(1);

    const postResponse = await request(socketServer)
      .post('/api/communities')
      .send({
        name: "eee",
        address: {
          street: "PCH",
          city: "Malibu",
          stateAbbr: "CA",
          zipCode: "90210"
        }
      });
    crudId = postResponse.body._id.toString();

    expect(postResponse.body.name).toEqual("eee");
  });

  test('3.) /api/communites/:id' + ' Get ONE Community Chat data.', async () => {
    expect.assertions(4);
  
    const response = await request(socketServer)
      .get('/api/communities/' + crudId)

    const commName = response.body.data.name;
    const commCity = response.body.data.address.city;
    const commState = response.body.data.address.stateAbbr;
    const commZip = response.body.data.address.zipCode;

    expect(response.body.data.name).toEqual(commName)
    expect(response.body.data.address.city).toEqual(commCity)
    expect(response.body.data.address.stateAbbr).toEqual(commState)
    expect(response.body.data.address.zipCode).toEqual(commZip)
  })

  test('4.) /api/communities/:id' + ' DELETE: delete a Community Chat Document.', async () => {
    expect.assertions(1)
    const response = await request(socketServer)
      .delete('/api/communities/' + crudId)

    expect(response.body._id).toEqual(crudId)

  });

});
