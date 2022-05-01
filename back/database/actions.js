import { Message, User} from './shema.js';


export const setUser = (user) => {
    User.create(user).then(() => {
        console.log('user created');
    }).catch((e) => {
        console.log(e.message);
    });
}

export const updateUserStatus = async (user) => {
    try{
        await User.updateOne({name: user.name}, {lastStatus: user.lastStatus}).exec(); //res.modifiedCount
    }catch(e){
        console.log(e.message);
    }
}

export const getUser = async (user) => {
    try{
        const data = await User.find(user).exec();
        return data;
    }catch(e){
        console.log(e.message);
    }
    return [];
}

export const setMessage = async (message) => {
    try{
        await Message.create(message);
    }catch(e){
        console.log(e.message);
    }
}

export const getMessage = async () => {
    try{
        const messages = await Message.find({}).exec();
        return messages;
    }catch(e){
        console.log(e.message);
    }
    return [];
}

export const getSingleMessage = async (id) => {
    try{
        const messageId = {_id: id};
        const message = await Message.findOne(messageId).exec();
        return message;
    }catch(e){
        console.log(e.message);
    }
    return [];
}

export const updateMessage = async (id, message) => {
    try{
        const messageId = {_id: id};
        await Message.findOneAndUpdate(messageId, message).exec();
    }catch(e){
        console.log(e.message);
    }
} 

export const unlinkUser = async (idUser) => { 
    try{
        await User.deleteOne(idUser).exec();
    }catch(e){
        console.log(e.message);
    }
}

export const unlinkMessage = async (options) => {
    try{
        await Message.findOneAndDelete(options).exec();
    }catch(e){
        console.log(e.message);
    }
}