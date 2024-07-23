'use server';
import axios from 'axios';
import { cookies } from 'next/headers';
const backEndUrl = process.env.BACKEND_URL;
export async function signInProceed({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) {
  try {
    const res = await axios.post(
      '/auth/sign-in',
      { identifier, password },
      {
        withCredentials: true,
        signal: AbortSignal.timeout(8000),
        baseURL: backEndUrl,
      },
    );

    // Axios automatically parses the response as JSON
    // console.log('Response data:', res.data);
    cookies().set('auth_token', res.data.auth_token);
    cookies().set('verification', res.data.verification);
    return true; // Return success indicator
  } catch (error: any) {
    return error.response.data.error.errors as Array<any>;
  }
}

/**
 * fetch version
 */
// export async function signInProceed({
//   identifier,
//   password,
// }: {
//   identifier: string;
//   password: string;
// }) {
//   try {
//     const response = await fetch('http://localhost:3000/api/backend/auth/sign-in', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ identifier, password }),
//       credentials: 'include', // This sets `withCredentials` to true
//       signal: AbortSignal.timeout(2000), // Timeout signal
//     });

//     if (!response.ok) {
//       // Handle HTTP errors
//       const errorData = await response.json();
//       console.error('Error response:', errorData);
//       return errorData; // Return error response for further handling
//     }

//     const data = await response.json();
//     console.log('Response data:', data);
//     return true; // Return success indicator

//   } catch (error) {
//     console.error('Fetch error:', error);
//     // You might want to handle specific error cases differently here
//     return { error: error.message || 'An unknown error occurred' };
//   }
// }
