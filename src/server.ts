import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';

const router = express();

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => console.log('Database connected'))
  .catch(error => console.log(error));
