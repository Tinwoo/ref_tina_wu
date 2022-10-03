export interface User {
  id: number;
  player_name: string;
  username: string;
  password: string;
}

export interface Chatroom {
  id: number;
  host_id: string;
  join_id: string;
}

export interface Exe {
  id: number;
  users_id: string;
  point: number;
}

export interface SocketIO {
  id: number;
}
