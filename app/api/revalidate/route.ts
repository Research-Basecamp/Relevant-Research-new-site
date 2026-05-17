import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const paths = body.paths || ["/", "/work", "/news", "/team", "/services", "/contact"];

    await Promise.all(paths.map((path: string) => revalidatePath(path)));

    return NextResponse.json({ revalidated: true, paths });
  } catch (error) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}
