import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Workspace from "@/models/workspace";
import { verifyJwtToken } from '@/lib/jwt'

export const GET = async (request) => {
  const accessToken = request.headers.get("authorization")
  const token = accessToken?.split(' ')[1]

  const decodedToken = verifyJwtToken(token)  

  if (!accessToken || !decodedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const workspaces = await Workspace.find({user: decodedToken.email}).sort({ createdAt: -1 })

    return new NextResponse(JSON.stringify(workspaces), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const POST = async (request) => {
  const accessToken = request.headers.get("authorization")
  const token = accessToken?.split(' ')[1]

  const decodedToken = verifyJwtToken(token)  

  if (!accessToken || !decodedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const body = await request.json();

  const workspace = await Workspace.findOne({user: decodedToken.email, name: body.name})

  if (workspace) {
    return new NextResponse(JSON.stringify({error: "Workspace already exists"}), { status: 400 });
  }

  const newWorkspace = new Workspace({...body, user: decodedToken.email});

  try {
    await connect();

    await newWorkspace.save();

    return new NextResponse(JSON.stringify(newWorkspace), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};