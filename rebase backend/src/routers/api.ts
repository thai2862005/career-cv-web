import express, { Express } from 'express';
import { CreateUSerApi, DeleteUserApi, GetAllUsersApi, GetUserByIdApi } from '../controller/user.controller/user.controller';
const router = express.Router();

const webRouterApi =(app:Express)=>{
    app.use("/api/v1",router);
    app.post("/users",CreateUSerApi);
    app.delete("/users/:id",DeleteUserApi);
    app.get("/users/:id",GetUserByIdApi);
    app.get("/users",GetAllUsersApi);
}
export {webRouterApi};