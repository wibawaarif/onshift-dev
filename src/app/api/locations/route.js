import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Location from "@/models/location";
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

    const locations = await Location.find({user: decodedToken.email}).sort({ createdAt: -1 })

    return new NextResponse(JSON.stringify(locations), { status: 200 });
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

  const location = await Location.findOne({user: decodedToken.email, name: body.name})

  if (location) {
    return new NextResponse(JSON.stringify({error: "Location already exists"}), { status: 400 });
  }

  const newLocation = new Location({...body, user: decodedToken.email});

  try {
    await connect();

    await newLocation.save();

    return new NextResponse(JSON.stringify(newLocation), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};