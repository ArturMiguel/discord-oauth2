import './lib/env';
import express from 'express';
import cors from 'cors';

import discordApi from './api/discord.api';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/discord', discordApi);

export default app;
