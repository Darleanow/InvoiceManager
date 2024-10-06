const request = require('supertest');
const express = require('express');
const testRouter = require('../routes/index');

let app;

beforeAll(() => {
  app = express();
  app.use('/', testRouter);
});

describe('Examples Controller', () => {
  it('should add two numbers', async () => {
    const num1 = 5;
    const num2 = 3;
    const response = await request(app).get(`/test/add/${num1}/${num2}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result', num1 + num2);
  });

  it('should multiply two numbers', async () => {
    const num1 = 4;
    const num2 = 7;
    const response = await request(app).get(`/test/multiply/${num1}/${num2}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result', num1 * num2);
  });

  it('should reverse a string', async () => {
    const input = 'hello';
    const reversed = input.split('').reverse().join('');
    const response = await request(app).get(`/test/reverse/${input}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reversed', reversed);
  });

  it('should handle invalid numbers for addition', async () => {
    const num1 = 'a';
    const num2 = 'b';
    const response = await request(app).get(`/test/add/${num1}/${num2}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result', null);
  });

  it('should handle invalid numbers for multiplication', async () => {
    const num1 = 'x';
    const num2 = 'y';
    const response = await request(app).get(`/test/multiply/${num1}/${num2}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result', null);
  });

});
