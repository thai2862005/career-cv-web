import express, { Express } from 'express';
const router = express.Router();

const webRouterApi =(app:Express)=>{
    app.use("/api",router);
}
export {webRouterApi};