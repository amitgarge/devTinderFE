export interface Message {
    _id: string;
    senderId: string;
    text: string;
    createdAt: string;
    seen: boolean;
    seenAt?: string | Date;
    delivered?: boolean;
}

export interface MessagesResponse {
    success: boolean;
    message: string;
    data: Message[];
    nextCursor: string | null;
}

export interface MessageSeenPayload {
    seenBy: string;
}

export interface MessageDeliveredPayload {
    messageId: string;
}

export interface MessageDeliveredBulkPayload {
    deliveredTo: string;
}

export interface UsersOnlinePayload {
    userId: string;
}

export interface UsersOfflinePayload {
    userId: string;
    lastSeen: string | Date;
}

export interface LastSeenResponse {
  lastSeen: string;
}