import { NextResponse } from "next/server";
import connect from "@/utils/db";
import TimeOffRequest from "@/models/timeOffRequest";
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

    const timeOffRequests = await TimeOffRequest.find({workspace}).populate('employee');

    return new NextResponse(JSON.stringify(timeOffRequests), { status: 200 });
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
  console.log(body)
  const newTimeOffRequest = new TimeOffRequest(body);

  try {
    await connect();

    await newTimeOffRequest.save();

    return new NextResponse(JSON.stringify(newTimeOffRequest), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};