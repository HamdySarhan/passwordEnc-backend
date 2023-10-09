const request = require('supertest');
const app = require('../api/index');

describe('Encryption Endpoint', () => {
  it('should encrypt the provided password', async () => {
    const password = 'testPassword';

    const response = await request(app)
      .post('/encrypt')
      .send({ password })
      .expect(200);

    expect(response.body).toHaveProperty('salt');
    expect(response.body).toHaveProperty('encryptedPassword');
  });

  it('should return a 400 error for missing password', async () => {
    await request(app).post('/encrypt').send({}).expect(400);
  });
});
