// tests/contact.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('Contact API', () => {
    let authToken;
    let testMessageId;

    beforeAll(async () => {
        authToken = 'your_test_token';
    });

    afterAll(async () => {
        await db.end();
    });

    describe('POST /api/contact/messages', () => {
        it('should create a new message', async () => {
            const newMessage = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'Test Message Content'
            };

            const res = await request(app)
                .post('/api/contact/messages')
                .send(newMessage);

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty('id');
            testMessageId = res.body.data.id;
        });
    });

    describe('GET /api/contact/messages', () => {
        it('should get all messages with auth', async () => {
            const res = await request(app)
                .get('/api/contact/messages')
                .set('Authorization', `Bearer ${authToken}`);
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });

        it('should fail without auth', async () => {
            const res = await request(app)
                .get('/api/contact/messages');
            
            expect(res.statusCode).toBe(401);
        });
    });

    describe('PUT /api/contact/messages/:id/status', () => {
        it('should update message status', async () => {
            const res = await request(app)
                .put(`/api/contact/messages/${testMessageId}/status`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ status: 'processed' });

            expect(res.statusCode).toBe(200);
        });
    });
});