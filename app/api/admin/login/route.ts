// import { NextResponse } from 'next/server';
// import pool from '@/backend/config/db';
// import bcrypt from 'bcryptjs';

import { loginEmployee } from "@/backend/controller/employeeController";
import { createEdgeRouter } from "next-connect";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     console.log('🔐 Admin login attempt...');

//     const { email, password } = await request.json();
//     console.log('📧 Email:', email);

//     if (!email || !password) {
//       console.log('❌ Missing email or password');
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     // Query user from database
//     console.log('🔍 Querying database for user...');
//     const result = await pool.query(
//       'SELECT user_id, email, password, user_role, name, picture FROM users WHERE email = $1',
//       [email]
//     );

//     console.log('📊 Query result rows:', result.rows.length);
//     const user = result.rows[0];

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }

//     // Check if user has admin role (Owner, Csr, Cleaner, or Partner)
//     const adminRoles = ['Owner', 'Csr', 'Cleaner', 'Partner'];
//     if (!adminRoles.includes(user.user_role)) {
//       return NextResponse.json(
//         { error: 'You do not have admin access' },
//         { status: 403 }
//       );
//     }

//     // Verify password (if password exists in database)
//     if (user.password) {
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return NextResponse.json(
//           { error: 'Invalid email or password' },
//           { status: 401 }
//         );
//       }
//     } else {
//       // If no password is set (Google OAuth users), deny access
//       return NextResponse.json(
//         { error: 'Please use Google Sign-In for this account' },
//         { status: 401 }
//       );
//     }

//     // Update last login
//     await pool.query(
//       'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
//       [user.user_id]
//     );

//     // Return success with user data and role
//     return NextResponse.json({
//       success: true,
//       user: {
//         id: user.user_id,
//         email: user.email,
//         name: user.name,
//         role: user.user_role,
//         picture: user.picture,
//       },
//     });
//   } catch (error: any) {
//     console.error('❌ Admin login error:', error);
//     console.error('Error details:', {
//       message: error?.message,
//       code: error?.code,
//       stack: error?.stack
//     });
//     return NextResponse.json(
//       {
//         error: 'Internal server error',
//         details: error?.message || 'Unknown error'
//       },
//       { status: 500 }
//     );
//   }
// }

type RequestContext = Record<string, never>;

const router = createEdgeRouter<NextRequest, RequestContext>();
router.post(loginEmployee);

export async function POST(request: NextRequest, ctx: RequestContext): Promise<NextResponse> {
  return router.run(request, ctx) as Promise<NextResponse>;
}