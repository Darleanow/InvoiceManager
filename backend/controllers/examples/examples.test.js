// controllers/examples.test.js
const request = require('supertest');
const app = require('../../app');

describe('Examples Controller API', () => {
  
  it('should return the sum of two numbers', async () => {
    const res = await request(app).get('/api/test/add/5/3');
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toEqual(8);
  });

  it('should return the product of two numbers', async () => {
    const res = await request(app).get('/api/test/multiply/4/2');
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toEqual(8);
  });

  it('should return the reversed string', async () => {
    const res = await request(app).get('/api/test/reverse/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.body.reversed).toEqual('olleh');
  });

});
