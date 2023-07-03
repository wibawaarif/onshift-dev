import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Location from "@/models/location";

export const PUT = async (request, { params }) => {
  const { id } = params;
  const body = await request.json();

  try {
    await connect();

    const location = await Location.findById(id)

    location.set({
      ...body
    })

    await location.save();

    return new NextResponse(JSON.stringify(location), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
}

export const DELETE = async (_, { params }) => {
  const { id } = params;

  try {
    await connect();

    await Location.findByIdAndDelete(id);

    return new NextResponse("Location has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};