import type {NextRequest} from "next/server";
import {NextResponse} from "next/server";
import { APP_ROUTE, TOKEN_ACCESS } from "./types/general";
import { cookies } from "next/headers";

const routeBlock = [
  '/',
  '/giang-vien',
  '/giang-vien/them-moi'
]
const routeHaveToken = [
  '/dang-nhap',
  '/quen-mat-khau',
]
export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const cookie = await cookies();
  const token = cookie.get(TOKEN_ACCESS)?.value;
  // if (routeBlock.includes(pathname) && !token) {
  //   return NextResponse.redirect(new URL(APP_ROUTE.DANG_NHAP, req.url));
  // }
  // if(routeHaveToken.includes(pathname) && token){
  //   return NextResponse.redirect(new URL(APP_ROUTE.DASHBOARD, req.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher:  [
    '/:path*',
    "/",
  ],
};
