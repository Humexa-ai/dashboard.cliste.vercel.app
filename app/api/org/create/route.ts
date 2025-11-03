import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const name = (body?.name as string | undefined)?.trim();
    if (!name) {
      return NextResponse.json({ error: "Missing organization name" }, { status: 400 });
    }

    const client = await clerkClient();
    const org = await client.organizations.createOrganization({ name, createdBy: userId });

    return NextResponse.json({ id: org.id, name: org.name }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to create organization" }, { status: 500 });
  }
}


