import cors from 'cors';
import { json } from 'express';
import { postStatus } from './routes/status/statusRoute.js'
import { postParticipants, getParticipants } from './routes/participants/participantRoutes.js';
import { postMessages, getMessages, editMessage, deleteMessage } from './routes/messages/messageRoute.js';

const routes = (app) => {
    app.use(cors());
    app.use(json());
    
    postParticipants(app);
    getParticipants(app);

    postMessages(app);
    getMessages(app);    
    editMessage(app);
    deleteMessage(app);
    
    postStatus(app);
}

export default routes;
