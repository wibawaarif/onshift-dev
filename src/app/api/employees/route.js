import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Employee from "@/models/employee";
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

    const employees = await Employee.find({user: decodedToken.email}).sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify(employees), { status: 200 });
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

  const newEmployee = new Employee({...body, user: decodedToken.email});

  try {
    await connect();

    await newEmployee.save();

    return new NextResponse(JSON.stringify(newEmployee), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};