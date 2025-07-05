import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { APP_ROUTE, REFRESH_TOKEN, TOKEN_ACCESS } from './types/general';
import { cookies } from 'next/headers';
import path from 'path';

const routeBlock = ['/', '/giang-vien', '/giang-vien/them-moi'];
const routeHaveToken = ['/dang-nhap', '/quen-mat-khau'];
export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const cookie = await cookies();
  const refresh_token = cookie.get(REFRESH_TOKEN)?.value;
  if (routeBlock.includes(pathname) && !refresh_token) {
    return NextResponse.redirect(new URL(APP_ROUTE.DANG_NHAP, req.url));
  }
  if (routeHaveToken.includes(pathname) && refresh_token) {
    return NextResponse.redirect(new URL(APP_ROUTE.DASHBOARD, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*', '/']
};
