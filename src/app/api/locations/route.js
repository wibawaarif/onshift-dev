import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Location from "@/models/location";
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

    const locations = await Location.find({user:session.user.email, workspace}).sort({ createdAt: -1 })

    return new NextResponse(JSON.stringify(locations), { status: 200 });
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

  const location = await Location.findOne({user:session.user.email, name: body.name})

  if (location) {
    return new NextResponse(JSON.stringify({error: "Location already exists"}), { status: 400 });
  }

  const newLocation = new Location({...body, user: session.user.email});

  try {
    await connect();

    await newLocation.save();

    return new NextResponse(JSON.stringify(newLocation), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};