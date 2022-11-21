const app = require('../server')
const supertest = require('supertest')
const request = supertest(app)

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const response = await request.get('/answers')
        expect(response.status).toBe(200)
    })
    it('should create a new post', async () => {
        const response = await request.get('/answers/topten')
        expect(response.status).toBe(200)
    })
    it('should create a new post', async () => {
        const response = await request.get('/answers/all')
        expect(response.status).toBe(200)
    })

})