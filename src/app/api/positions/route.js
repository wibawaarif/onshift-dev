import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Position from "@/models/position";
import { verifyJwtToken } from '@/lib/jwt'

export const GET = async (request) => {
  const accessToken = request.headers.get("authorization")
  const token = accessToken?.split(' ')[1]
  const workspace = accessToken?.split(' ')[2]

  const decodedToken = verifyJwtToken(token)  
  if (!accessToken || !decodedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const positions = await Position.find({user: decodedToken.email, workspace}).sort({ createdAt: -1 }).populate('employees');

    return new NextResponse(JSON.stringify(positions), { status: 200 });
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

  const newPosition = new Position({...body, user: decodedToken.email});

  try {
    await connect();

    await newPosition.save();

    return new NextResponse(JSON.stringify(newPosition), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};