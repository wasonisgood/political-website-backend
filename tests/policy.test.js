// tests/policy.test.js
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

describe('Policy API', () => {
    let authToken;
    let testPolicyId;

    beforeAll(async () => {
        // 這裡應該先獲取認證token
        // 實際實現時需要添加認證相關的邏輯
        authToken = 'your_test_token';
    });

    afterAll(async () => {
        await db.end();
    });

    describe('GET /api/policies', () => {
        it('should get all policies', async () => {
            const res = await request(app)
                .get('/api/policies');
            
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBeTruthy();
        });
    });

    describe('POST /api/policies', () => {
        it('should create a new policy', async () => {
            const newPolicy = {
                title: 'Test Policy',
                description: 'Test Description',
                content: 'Test Content',
                category_id: 1,
                objectives: [
                    { objective: 'Test Objective 1' }
                ],
                implementations: [
                    { step: 'Test Step 1', progress: 0 }
                ]
            };

            const res = await request(app)
                .post('/api/policies')
                .set('Authorization', `Bearer ${authToken}`)
                .send(newPolicy);

            expect(res.statusCode).toBe(201);
            expect(res.body.data).toHaveProperty('id');
            testPolicyId = res.body.data.id;
        });
    });

    describe('GET /api/policies/:id', () => {
        it('should get policy by id', async () => {
            const res = await request(app)
                .get(`/api/policies/${testPolicyId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toHaveProperty('title', 'Test Policy');
        });
    });
});

