import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Position from "@/models/position";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const GET = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { workspace } = session.user

  try {
    await connect();

    const positions = await Position.find({user: session.user.email, workspace}).sort({ createdAt: -1 }).populate('employees');

    return new NextResponse(JSON.stringify(positions), { status: 200 });
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

  const newPosition = new Position({...body, user: session.user.email});

  try {
    await connect();

    await newPosition.save();

    return new NextResponse(JSON.stringify(newPosition), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};