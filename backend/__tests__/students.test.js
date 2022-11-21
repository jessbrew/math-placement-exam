const app = require('../server')
const supertest = require('supertest')
const request = supertest(app)

describe('Post Endpoints', () => {
    it('should create a new post', async () => {
        const response = await request.get('/students/all')
        expect(response.status).toBe(200)
    })
    // it('should create a new post', async () => {
    //     const response = await request.get('/students/:id')
    //     expect(response.status).toBe(200)
    // })
    // it("should test login", async () => {
    //     const response = await request.post('/students/login')
    //     expect(response.status).toBe(200)
    // })

})