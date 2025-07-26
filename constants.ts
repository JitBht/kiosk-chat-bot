
import { v4 as uuidv4 } from 'uuid';
import { Sender, type Message } from './types';

export const INITIAL_BOT_MESSAGE: Message = {
    id: uuidv4(),
    sender: Sender.Bot,
    text: "Hello! I'm your friendly health assistant. I'm here to listen to your symptoms. Please tell me how you're feeling, and I'll do my best to help.",
};
