import request from 'supertest';
import app from '../../src/index';
import { User } from '../../src/database/models/user.model';

describe('Create New User', () => {
  test('It should create a new user', async () => {
    const res = await request(app).post('/api/signup').send({
      username: 'testuser0',
      firstname: 'test',
      lastname: 'user',
      email: 'testuser0@example.com',
      password: '#Test1234',
    });

    expect(res.body.newUser).toHaveProperty('id');
    expect(res.body.newUser).toHaveProperty('updatedAt');
    expect(res.body.newUser).toHaveProperty('createdAt');
    expect(res.statusCode).toBe(201);
  });

  test('It should handle exceptions', async () => {
    const res = await request(app).post('/api/signup').send({});
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
