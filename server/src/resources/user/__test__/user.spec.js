import mongoose from 'mongoose'
import request from 'supertest'
import { socketServer } from '../../../server'
import path from 'path'
import User from '../user.model'

// check user routes

describe('API TEST: User CONTROLLERS', () => {
  // variables to hold sessions id, headers, and user info
  let user, sessions, friendId
  beforeAll(async () => {
    friendId = mongoose.Types.ObjectId()
    // Clears the database and adds some testing data.
    // Jest will wait for this promise to resolve before running tests.
    try {
      user = await request(socketServer)
        .post('/login')
        .send({ username: 'Jennifer', password: 'jennifer' })

      /**
       *  set cookies with sessions id so user can be authenticated
       *  */
      sessions = user
        .headers['set-cookie'][0]
        .split(',')
        .map(item => item.split(';')[0])
        .join(';')


    } catch (err) {
      expect(err).toEqual({
        error: 'Login user Error',
      });
    }
  });

  afterAll(() => {
    mongoose.disconnect()
  });

  test('`/signup` POST: Create a user "kenny".', async () => {
    expect.assertions(1)

    await request(socketServer)
      .post('/signup')
      .set('Connection', 'keep alive')
      .set('Accept', 'multipart/form-data')
      // .set('Content-Type', 'multipart/form-data')
      .field('username', 'kenny')
      .field('password', 'hong')
      .field('gender', 'male')
      .field('age', '40')
      // set path to dist/ folder because test files are ran from dist/
      .attach('photo', path.join(__dirname, '../../../../public/default-avatar.svg'))
      .expect(200)

    let findUserKenny = await User.findOne({ username: 'kenny' }).lean().exec()
    expect(findUserKenny.username).toEqual('kenny')
  })

  test('`/login` as kenny', async () => {
    expect.assertions(2)
    let userKenny = await request.agent(socketServer)
      .post('/login')
      .send({ username: 'kenny', password: 'hong' })
      .expect(200)

    expect(userKenny.body.user.username).toEqual('kenny')
    expect(userKenny.body.user.avatar).toEqual('default-avatar.svg')
  })

  test('`/delete-user` DELETE: Delete user kenny from database', async () => {
    expect.assertions(2);

    let deletedUser = await request(socketServer)
      .delete('/delete-user')
      .send({ username: 'kenny', password: 'hong' })
      .expect(200);

    expect(deletedUser.body.message).toEqual('Delete');
    expect(deletedUser.body.user.username).toEqual('kenny')
  })

  test('`/api/user/:id/avatar` PUT: Change Jennifer\'s avatar photo.', async () => {
    expect.assertions(2)

    let updatedAvatar = await request(socketServer)
      .put(`/api/user/${user._id}/avatar`)
      .set('Connection', 'keep alive')
      // add current sessions to cookie
      .set('Cookie', sessions)
      .set('Accept', 'multipart/form-data')
      .field('username', 'Jennifer')
      .field('password', 'Jennifer')
      // set path to dist/ folder because test files are ran from dist/
      .attach('photo', path.join(__dirname, '../../../../public/default-avatar.svg'))
      .expect(200)

    expect(updatedAvatar.body.user.username).toEqual('Jennifer')
    expect(updatedAvatar.body.user.avatar).toEqual('default-avatar.svg')
  })

  test('`/api/preference/filter` POST: Send pref options and respond with json.', async () => {
    expect.assertions(1)

    const filter = await request(socketServer)
      .post('/api/preference/filter')
      .set('Cookie', sessions)
      .send({ gender: ['male', 'female'], age: { min: '25', max: '30' } })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)

    const bodyLen = filter.body.length
    expect(filter.body).toHaveLength(bodyLen)
  });

  test('`/api/matched/users/:id` GET:  Get all users from database', async () => {
    expect.assertions(2)

    const id = user.body.user._id
    const response = await request(socketServer)
      .get(`/api/matched/users/${id}`)
      // add current sessions to cookie
      .set('Cookie', sessions);

    let bodyLen = response.body.length;
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(bodyLen);
  })

  test('`/api/unseen-user-messages/:id` GET: get array of users with number of unseen messages', async () => {
    expect.assertions(1);
    const id = user.body.user._id;
    const response = await request(socketServer)
      .get(`/api/unseen-user-messages/${id}`)
      // add user sessions to cookie
      .set('Cookie', sessions)
      .expect(200);

    expect(response.body).toEqual(response.body);
  })

  test('`/api/friend/:friendid/:op/:id` PUT: Add a friend to Jennifer\'s friends field ', async () => {
    expect.assertions(1)

    const user = await User.findOne({ username: 'Jennifer' }).lean().exec()

    await request(socketServer)
      .put(`/api/friend/${friendId.toString()}/add/${user._id.toString()}`)
      .set('Cookie', sessions)
      .expect(200)

    const userHasOneFriend = await User.findById(user._id).lean().exec();
    expect(userHasOneFriend.friends.length).toEqual(userHasOneFriend.friends.length)
  })

  test('`/api/friend/:friendid/:op/:id` PUT: Remove a friend to Jennifer\'s friends field ', async () => {
    expect.assertions(1)

    const user = await User.findOne({ username: 'Jennifer' }).lean().exec()

    await request(socketServer)
      .put(`/api/friend/${friendId.toString()}/remove/${user._id.toString()}`)
      // .set('Connection', 'keep alive')
      .set('Cookie', sessions)
      .expect(200)

    const userHasOneFriend = await User.findById(user._id).lean().exec();
    expect(userHasOneFriend.friends.length).toEqual(userHasOneFriend.friends.length)
  })

  // this test must be run before /logout that removes the session
  test('`/api/user` GET: get current user in session (Jennifer)', async () => {
    expect.assertions(1)
    const response = await request(socketServer)
      .get('/api/user')
      // add user sessions to cookie
      .set('Cookie', sessions)
      .expect(200)

    const user = response.body.user
    expect(user.username).toEqual('Jennifer')
  })

  test('`/logout` GET: Logout route', async () => {
    expect.assertions(1)
    const response = await request(socketServer)
      .get('/logout')
      // add current sessions to cookie to remove (Jennifer) session
      .set('Cookie', sessions)
    expect(response.body.message).toEqual("You have logged out")
  })

  test('`/error` GET: Error route', async () => {
    expect.assertions(1)
    const response = await request(socketServer)
      .get('/error')
      .expect(400)

    expect(response.body.message).toEqual('Invalid username & password combination...')
  })

})

