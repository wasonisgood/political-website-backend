// tests/activity.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('Activity API', () => {
    let authToken;
    let testActivityId;

    beforeAll(async () => {
        authToken = 'your_test_token';
    });

    afterAll(async () => {
        await db.end();
    });

    describe('GET /api/activities', () => {
        it('should get all activities', async () => {
            const res = await request(app)
                .get('/api/activities');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
    });

    describe('POST /api/activities', () => {
        it('should create a new activity', async () => {
            const newActivity = {
                title: 'Test Activity',
                description: 'Test Description',
                date: '2024-07-15',
                time_start: '14:00',
                time_end: '16:00',
                location: 'Test Location',
                category_id: 1,
                agenda: [
                    {
                        time_slot: '14:00-14:30',
                        description: 'Opening'
                    }
                ]
            };

            const res = await request(app)
                .post('/api/activities')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newActivity);

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty('id');
            testActivityId = res.body.data.id;
        });
    });

    describe('GET /api/activities/:id', () => {
        it('should get activity by id', async () => {
            const res = await request(app)
                .get(`/api/activities/${testActivityId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('title', 'Test Activity');
        });
    });
});

