import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Timesheet from "@/models/timesheet";

export const GET = async (request) => {
  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const timesheets = await Timesheet.find({});

    return new NextResponse(JSON.stringify(timesheets), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const POST = async (request) => {
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