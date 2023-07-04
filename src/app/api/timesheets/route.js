import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Timesheet from "@/models/timesheet";
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

    const timesheets = await Timesheet.find({}).populate('employee');

    return new NextResponse(JSON.stringify(timesheets), { status: 200 });
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

  const newTimesheet = new Timesheet(body);

  try {
    await connect();

    await newTimesheet.save();

    return new NextResponse(JSON.stringify(newTimesheet), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};