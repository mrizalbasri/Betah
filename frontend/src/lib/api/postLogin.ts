import { apiRequest, ApiError } from "@/lib/api/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: UserInfo;
}

export async function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const data = await apiRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
    });
    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        throw new Error("Email atau password yang Anda masukkan salah.");
      }
    }
    // Fallback error
    throw new Error("Gagal terhubung ke server autentikasi. Silakan periksa jaringan Anda.");
  }
}
