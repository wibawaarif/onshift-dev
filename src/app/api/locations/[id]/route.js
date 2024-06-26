import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Location from "@/models/location";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const PUT = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { id } = params;
  const body = await request.json();

  const findExistedLocation = await Location.findOne({user: session.user.email, name: body.name})

  if (findExistedLocation && String(findExistedLocation._id) !== id) {
    return new NextResponse(JSON.stringify({error: "Location already exists"}), { status: 400 });
  }

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

export const DELETE = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }
  
  const { id } = params;

  try {
    await connect();

    await Location.findByIdAndDelete(id);

    return new NextResponse("Location has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};