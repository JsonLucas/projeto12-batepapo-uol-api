import { setUser, getUser, updateUserStatus, setMessage, unlinkUser } from '../../database/actions.js';
import dbConnection from '../../database/dbConnection.js';
import dayjs from 'dayjs';
import Joi from 'joi';
export const postParticipants = (app) => {
    const validateUser = Joi.object({
        name: Joi.string().disallow('<', '>').required()
    });
    app.post('/participants', async (req, res) => {
        await dbConnection();
        try {
            const name = req.body.name;
            const lastStatus = Date.now();
            if (name === '') {
                res.status(422).send('O campo nome não pode ser vazio.');
            } else {
                let user = {
                    name: name
                };
                const queryUsers = await getUser(user);
                if (queryUsers.length === 0) {
                    const message = {
                        from: user.name,
                        to: 'Todos',
                        text: 'entra na sala. . .',
                        type: 'status',
                        time: dayjs(lastStatus).format('HH:mm:ss')
                    }
                    await setMessage(message);
                    await setUser({ ...user, lastStatus });
                    res.sendStatus(201);
                }
            }
            res.sendStatus(409);
        } catch (e) {
            console.log(e.message);
        }
    });
}
export const getParticipants = (app) => {
    app.get('/participants', async (req, res) => {
        try {
            const user = { name: req.headers.user };
            const now = Date.now();
            const query = await getUser({});
            setInterval(async () => {
                for(let i in query){
                    if(parseInt(query[i].lastStatus) < (now-10000)){
                        const message = {
                            from: user.name,
                            to: 'Todos',
                            text: 'sai da sala. . .',
                            type: 'status',
                            time: dayjs(now).format('HH:mm:ss')
                        }
                        await unlinkUser({_id: query[i]._id});
                        await setMessage(message);
                    }
                }
            }, 15000);
            const filteredQuery = await getUser({});
            res.send(filteredQuery);
        } catch (e) {
            console.log(e.message);
            res.send([]);
        }
    });
}
