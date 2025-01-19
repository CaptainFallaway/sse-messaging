export interface Message {
  id: string;
  author: string;
  message: string;
}

export interface Modal {
  showModal: () => void;
  close: () => void;
}