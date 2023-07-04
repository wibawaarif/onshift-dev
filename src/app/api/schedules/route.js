import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Schedule from "@/models/schedule";
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

    const schedules = await Schedule.find({}).populate('organization').populate('shift').populate('employee');

    return new NextResponse(JSON.stringify(schedules), { status: 200 });
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

  const newSchedule = new Schedule(body);

  try {
    await connect();

    await newSchedule.save();

    return new NextResponse(JSON.stringify(newSchedule), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};