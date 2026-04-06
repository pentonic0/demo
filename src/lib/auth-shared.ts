export const SESSION_COOKIE_NAME = "school_admin_session";

export interface SessionPayload {
  id: string;
  username: string;
  role: string;
  expires: Date;
}
