import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Employee from "@/models/employee";
import { verifyJwtToken } from '@/lib/jwt'

export const PUT = async (request, { params }) => {
  const accessToken = request.headers.get("authorization")
  const token = accessToken?.split(' ')[1]

  const decodedToken = verifyJwtToken(token)  

  if (!accessToken || !decodedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { id } = params;
  const body = await request.json();

  try {
    await connect();

    const employee = await Employee.findById(id)

    employee.set({
      ...body
    })

    await employee.save();

    return new NextResponse(JSON.stringify(employee), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
}

export const DELETE = async (request, { params }) => {
  const accessToken = request.headers.get("authorization")
  const token = accessToken?.split(' ')[1]

  const decodedToken = verifyJwtToken(token)  

  if (!accessToken || !decodedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }
  
  const { id } = params;

  try {
    await connect();

    await Employee.findByIdAndDelete(id);

    return new NextResponse("Employee has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};