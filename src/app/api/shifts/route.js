import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Shift from "@/models/shift";

export const GET = async (request) => {
  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const shifts = await Shift.find({}).populate('location');

    return new NextResponse(JSON.stringify(shifts), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newShift = new Shift(body);

  try {
    await connect();

    await newShift.save();

    return new NextResponse(JSON.stringify(newShift), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};