import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Position from "@/models/position";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const PUT = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { id } = params;
  const body = await request.json();

  try {
    await connect();

    const position = await Position.findById(id)

    position.set({
      ...body
    })

    await position.save();

    return new NextResponse(JSON.stringify(position), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
}

export const DELETE = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }
  
  const { id } = params;

  try {
    await connect();

    await Position.findByIdAndDelete(id);

    return new NextResponse("Position has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};