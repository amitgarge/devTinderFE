import type { Message } from "./message";

export interface JoinRoomPayload {
    targetUserId: string;
}

export interface SendMessagePayload {
    targetUserId: string;
    text: string;
}

export interface TypingPayload {
    targetUserId: string;
}

export interface StopTypingPayload {
    targetUserId: string;
}

export interface UserOnlinePayload {
    userId: string;
}

export interface UserOfflinePayload {
    userId: string;
    lastSeen: string;
}

export interface UserTypingPayload {
    userId: string;
}

export interface MessagesSeenPayload {
    seenBy: string;
}

export interface MessageDeliveredPayload {
    messageId: string;
}

export interface MessageDeliveredBulkPayload {
    deliveredTo: string;
}

export interface ClientToServerEvents {
    get_online_users: () => void;

    join_room: (data: JoinRoomPayload) => void;

    send_message: (data: SendMessagePayload) => void;

    typing: (data: TypingPayload) => void;

    stop_typing: (data: StopTypingPayload) => void;
}

export interface ServerToClientEvents {
    online_users: (users: string[]) => void;

    user_online: (data: UserOnlinePayload) => void;

    user_offline: (data: UserOfflinePayload) => void;

    user_typing: (data: UserTypingPayload) => void;

    user_stop_typing: () => void;

    receive_message: (message: Message) => void;

    messages_seen: (data: MessagesSeenPayload) => void;

    message_delivered: (
        data: MessageDeliveredPayload,
    ) => void;

    message_delivered_bulk: (
        data: MessageDeliveredBulkPayload,
    ) => void;

    error: (message: string) => void;
}