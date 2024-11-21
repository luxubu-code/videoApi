import client from '../config/google';
import User from '../models/user';

async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
}
verify().catch(console.error);

