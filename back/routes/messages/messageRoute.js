import dayjs from "dayjs";
import Joi from 'joi';
import { setMessage, getMessage } from "../../database/actions.js";
export const getMessages = (app) => {
    app.get('/messages', async (req, res) => {
        const numMessages = { ...req.query };
        try {
            const user = req.headers.user;
            const allMessages = await getMessage();
            let userMessages = [];
            if (allMessages.length > numMessages.limit) {
                userMessages = filterUserMessages(numMessages.limit, allMessages, user);
            } else {
                userMessages = filterUserMessages(allMessages.length, allMessages, user);
            }
            res.status(200).send(userMessages);
        } catch (e) {
            console.log(e.message);
            res.sendStatus(404);
        }
    });
}

export const postMessages = (app) => {
    const validateMessage = Joi.object({
        from: Joi.string().required(),
        to: Joi.string().required(),
        text: Joi.string().required(),
        type: Joi.string().equal('message', 'private_message').required(),
        time: Joi.string().required()
    });
    app.post('/messages', async (req, res) => {
        try {
            const user = req.headers.user;
            const reqBody = { ...req.body };
            const bodyMessage = {
                from: user,
                ...reqBody,
                time: dayjs(Date.now()).format('HH:mm:ss')
            };
            const validated = await validateMessage.validateAsync(bodyMessage);
            await setMessage(validated);
            res.sendStatus(201);
        } catch (e) {
            console.log(e.message);
            res.sendStatus(422);
        }
    });
}

export const editMessage = (app) => {
    app.put('/messages/:messageId', (req, res) => {
        console.log(req.params);
    });
}

export const deleteMessage = (app) => {
    app.delete('/messages/:messageId', (req, res) => {
        console.log(req.params);
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
