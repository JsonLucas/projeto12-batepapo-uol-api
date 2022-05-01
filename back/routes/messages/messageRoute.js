import dayjs from "dayjs";
import Joi from 'joi';
import { setMessage, getMessage, getSingleMessage, updateMessage, unlinkMessage } from "../../database/actions.js";
const validateMessage = Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().equal('message', 'private_message').required(),
    time: Joi.string().required()
});
export const getMessages = (app) => {
    app.get('/messages', async (req, res) => {
        const numMessages = { ...req.query };
        try {
            const user = req.headers.user;
            const allMessages = await getMessage();
            /*let userMessages = [];
            if (allMessages.length > numMessages.limit) {
                userMessages = filterUserMessages(numMessages.limit, allMessages, user);
            } else {
                userMessages = filterUserMessages(allMessages.length, allMessages, user);
            }*/
            res.status(200).send(allMessages);
        } catch (e) {
            console.log(e.message);
            res.sendStatus(404);
        }
    });
}

export const postMessages = (app) => {
    app.post('/messages', async (req, res) => {
        const user = req.headers.user;
        const bodyMessage = {
            from: user,
            ...req.body,
            time: dayjs(Date.now()).format('HH:mm:ss')
        };
        validateMessage.validateAsync(bodyMessage).then(async (validated) => {
            await setMessage(validated);
            res.sendStatus(201);
        }).catch((e) => {
            console.log(e.message);
            res.sendStatus(422);
        });
        return;
    });
}

export const editMessage = (app) => {
    app.put('/messages/:messageId', async (req, res) => {
        try {
            const id = req.params.messageId;
            const query = await getSingleMessage(id);
            if (query) {
                const from = req.headers.user;
                if (query.from !== from) {
                    res.sendStatus(401);
                    return;
                }
                const message = {
                    from: from,
                    ...req.body,
                    time: dayjs(Date.now()).format('HH:mm:ss')
                };
                validateMessage.validateAsync(message).then(async (update) => {
                    await updateMessage(id, update);
                }).catch((e) => {
                    console.log(e.message);
                    res.sendStatus(422);
                });
                return;
            }
            res.sendStatus(404);
            return;
        } catch (e) {
            console.log(e.message);
        }
    });
}

export const deleteMessage = (app) => {
    app.delete('/messages/:messageId', async (req, res) => {
        try {
            const id = req.params.messageId;
            const query = await getSingleMessage(id);
            if (query) {
                const from = req.headers.user;
                if (query.from !== from) {
                    res.sendStatus(401);
                    return;
                }
                await unlinkMessage({ _id: id, from: from });
                return;
            }
            res.sendStatus(404);
            return;
        } catch (e) {
            console.log(e.message);
        }
    });
}

const filterUserMessages = (length, array, user) => {
    let userMessages = [];
    for (let i = 0; i < length; i++) {
        if ((array[i].from === user) ||
            (array[i].to === user) ||
            (array[i].to === 'Todos')) {
            userMessages.push(array[i]);
        }
    }
    return userMessages;
}
