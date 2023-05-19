import request from 'supertest';
import app from '../src/index';
import { User } from '../src/database/models/user.model';

describe('Create New User', () => {
  const user = {
    id: 1,
    username: 'testuser0',
    firstname: 'test',
    lastname: 'user',
    email: 'testuser0@example.com',
    password: '#Test1234',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  test('It should create a new user', async () => {
    const mockCreateUser = jest.fn((): any => user);

    jest.spyOn(User, 'create').mockImplementation(() => mockCreateUser());

    const res = await request(app).post('/api/signup').send(user);

    expect(mockCreateUser).toHaveBeenCalled();
    expect(res.body.newUser).toHaveProperty('id');
    expect(res.body.newUser).toHaveProperty('updatedAt');
    expect(res.body.newUser).toHaveProperty('createdAt');
    expect(res.statusCode).toBe(201);
  });

  test('It should handle exceptions', async () => {
    const mockCreateUser = jest.fn((): any => {
      throw 'error';
    });

    jest.spyOn(User, 'create').mockImplementation(() => mockCreateUser());
    const res = await request(app).post('/api/signup').send(user);

    expect(mockCreateUser).toHaveBeenCalled();
    expect(res.body).toHaveProperty('error');
    expect(res.statusCode).toBe(500);
  });

  test('It should ensure all properties are required', async () => {
    const res = await request(app).post('/api/signup').send({});

    expect(res.body).toEqual({
      error: '"username" is required',
    });
  });
});
