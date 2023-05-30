import request from 'supertest';
import app from '../../src/index';

describe('Login User', () => {
  test('It should authenticate a user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ emailOrUsername: 'testuser', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User Logged in Successfully');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
});
