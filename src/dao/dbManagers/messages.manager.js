import { messagesModel } from '../models/message.model.js'


export default class MessageManager {

    save = async (message) => {
        const result = await messagesModel.create(message);
        return result;
    }

    getAll = async () => {
        const messages = await messagesModel.find().lean()
        return messages
    }
}
