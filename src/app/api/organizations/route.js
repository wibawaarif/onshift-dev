import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Organization from "@/models/organization";
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

    const organizations = await Organization.find({});

    return new NextResponse(JSON.stringify(organizations), { status: 200 });
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

  const newOrganization = new Organization(body);

  try {
    await connect();

    await newOrganization.save();

    return new NextResponse(JSON.stringify(newOrganization), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};