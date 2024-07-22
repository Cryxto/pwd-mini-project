import axios from "axios";

export async function signInProceed({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) {
  try {
    await axios.post(
      '/api/backend/auth/sign-in',
      { identifier, password },
      { withCredentials: true, signal: AbortSignal.timeout(10000) },
    );
    return true;
  } catch (error: any) {
    
    return error.response.data.error.errors as Array<any>;
  }
}

