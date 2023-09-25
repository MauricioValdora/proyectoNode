
import mongoose from 'mongoose'

const messagesCollection = 'messages'

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: String
})

export const messagesModel = mongoose.model(messagesCollection, messageSchema);


