import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const CLIENT_ID = process.env.CLIENT_ID as string;
const CLIENT_SECRET = process.env.CLIENT_SECRET as string;
const REDIRECT_URI = 'http://localhost:3000/api/discord/auth-callback'

router.get('/auth', (request: Request, response: Response) => {
    response.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=identify`);
});

router.get('/auth-callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
    });

    try {
        const tokenRes = await axios.post('https://discordapp.com/api/oauth2/token', params, {});
        const token = tokenRes.data.access_token;

        const userRes = await axios.get(`https://discord.com/api/v6/users/@me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.send(userRes.data);
    } catch (err) {
       return res.send(err.response.data)
    }
});

export default router;
