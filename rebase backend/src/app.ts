import { Express } from "express";
import express from 'express';
import { webRouterApi } from "./routers/api";

const app =express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
webRouterApi(app);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});