import mongoose from "mongoose";
export const Message = mongoose.model('Message', {
    from: String,
    to: String,
    text: String,
    type: String,
    time: String
});

export const User = mongoose.model('User', {
    name: String,
    lastStatus: String
})
