import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Schedule from "@/models/schedule";

export const GET = async (request) => {
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