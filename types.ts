export enum Sender {
  User = 'user',
  Bot = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  suggestions?: string[];
  labTests?: string[];
  isRecommendation?: boolean;
}

export enum BotResponseType {
  CONTINUE_CONVERSATION = "CONTINUE_CONVERSATION",
  SUGGEST_MEDICINE = "SUGGEST_MEDICINE",
  SUGGEST_LAB_TEST = "SUGGEST_LAB_TEST",
  SUGGEST_CONSULTATION = "SUGGEST_CONSULTATION"
}

export interface BotResponse {
  responseType: BotResponseType;
  message: string;
  suggestions?: string[];
  labTests?: string[];
}