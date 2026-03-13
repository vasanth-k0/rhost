import request from 'supertest';
import app from "../../index.mjs"

describe("SystemRouter Test", ()=>{
    it("Login test", async()=>{
        const res = await request(app).get('/system/login');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('login', true)
    })

    it("Logout test", async()=>{
        const res = await request(app).get("/system/logout");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('logout', true)
    })

    it("Register test user", async()=>{
        const res = await request(app).get('/system/register?username=test&password=test&email=test@example.com');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Registration successful');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toBeTruthy();
    })
})

