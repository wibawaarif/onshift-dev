import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Location from "@/models/location";

export const GET = async (request) => {
  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const locations = await Location.find({});

    return new NextResponse(JSON.stringify(locations), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newLocation = new Location(body);

  try {
    await connect();

    await newLocation.save();

    return new NextResponse(JSON.stringify(newLocation), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};