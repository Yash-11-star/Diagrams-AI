import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("afd_session")?.value;
  const isDashboard = pathname.startsWith("/dashboard");

    return NextResponse.redirect(new URL("/login", request.url));

    return NextResponse.redirect(new URL("/dashboard", request.url));

}
export const config = {
};
