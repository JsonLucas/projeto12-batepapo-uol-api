import { Message, User} from './shema.js';


export const setUser = (user) => {
    User.create(user).then(() => {
        console.log('user created');
    }).catch((e) => {
        console.log(e.message);
    });
}

export const updateUserStatus = (user) => {
    User.updateOne({name: user.name}, {lastStatus: user.lastStatus}).then((res) => { 
        console.log('modificado:', res.modifiedCount);
     }).catch((e) => {
         console.log(e.message);
     });
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

export const setMessage = (message) => {
    Message.create(message).then(() => {
        console.log('message sent.');
    }).catch((e) => {
        console.log(e.message);
    });
}

export const getMessage = async () => {
    try{
        const users = await Message.find({}).exec();
        return users;
    }catch(e){
        console.log(e.message);
    }
    return [];
}

export const unlinkUser = async (idUser) => { 
    try{
        await User.deleteOne(idUser).exec();
    }catch(e){
        console.log(e.message);
    }
}

export const unlinkMessage = () => {
    Message.deleteOne();
}