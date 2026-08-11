import type { User } from "./user";

export type ConnectionRequestStatus = "ignored" | "accepted" | "rejected" | "interested";

export interface ConnectionRequest {
    _id: string;
    fromUserId: User;
    toUserId: string;
    status: ConnectionRequestStatus;
    createdAt: string;
    updatedAt: string;
}