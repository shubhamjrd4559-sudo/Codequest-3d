import apiClient, {
  setStoredTokens,
  clearStoredTokens,
  getStoredTokens,
} from "./client";
import {
  AuthTokens,
  LoginPayload,
  RegisterPayload,
  User,
} from "./types";

export const authApi = {
  async login(payload: LoginPayload): Promise<{ tokens: AuthTokens; user: User }> {
    const tokenRes = await apiClient.post<AuthTokens>("/auth/token/", payload);
    const tokens = tokenRes.data;
    setStoredTokens(tokens);

    // Fetch user profile immediately
    const userRes = await apiClient.get<User>("/auth/me/");
    return { tokens, user: userRes.data };
  },

  async register(payload: RegisterPayload): Promise<{ user: User; tokens?: AuthTokens }> {
    const registerRes = await apiClient.post<User>("/auth/register/", payload);
    const user = registerRes.data;

    // Automatically log in after registration to obtain JWT tokens
    try {
      const tokenRes = await apiClient.post<AuthTokens>("/auth/token/", {
        email: payload.email,
        password: payload.password,
      });
      const tokens = tokenRes.data;
      setStoredTokens(tokens);
      return { user, tokens };
    } catch {
      return { user };
    }
  },

  async getMe(): Promise<User> {
    const res = await apiClient.get<User>("/auth/me/");
    return res.data;
  },

  logout(): void {
    clearStoredTokens();
  },

  isAuthenticated(): boolean {
    const { access } = getStoredTokens();
    return Boolean(access);
  },
};
