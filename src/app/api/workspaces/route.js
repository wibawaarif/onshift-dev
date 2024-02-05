import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Workspace from "@/models/workspace";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const GET = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  try {
    await connect();

    const workspaces = await Workspace.find({user: session.user.email}).sort({ createdAt: -1 })

    return new NextResponse(JSON.stringify(workspaces), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const POST = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }
  const body = await request.json();

  const workspace = await Workspace.findOne({user: session.user.email, name: body.name})

  if (workspace) {
    return new NextResponse(JSON.stringify({error: "Workspace already exists"}), { status: 400 });
  }

  const newWorkspace = new Workspace({...body, user: session.user.email});

  try {
    await connect();

    await newWorkspace.save();

    return new NextResponse(JSON.stringify(newWorkspace), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};