export interface Notification {
  payload: {
    title: string;
    body: string;
    targetUserId: string;
    createdBy: string;
    action: string;
  };
}
