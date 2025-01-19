export interface Message {
  author: string;
  message: string;
}

export interface Modal {
  showModal: () => void;
  close: () => void;
}