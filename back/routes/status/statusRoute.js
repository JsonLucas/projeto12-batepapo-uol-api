import { getUser, updateUserStatus } from "../../database/actions.js";
import dayjs from "dayjs";
export const postStatus = (app) => {
    app.post('/status', async (req, res) => {
        try{
            const user = { name: req.headers.user };
            const query = await getUser(user);
            if(query.length === 0){
                res.sendStatus(404);
                return;
            } 
            const bodyUpdate = { ...user, lastStatus: Date.now() };
            await updateUserStatus(bodyUpdate);
            res.sendStatus(200);
        }catch(e){
            console.log(e.message);
            res.sendStatus(404);
        }
    });
}