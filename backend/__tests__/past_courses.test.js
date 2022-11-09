const app = require('../server')
const supertest = require('supertest')
const request = supertest(app)

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const response = await request.get('/pastcourse/all')
        expect(response.status).toBe(200)
    })
})