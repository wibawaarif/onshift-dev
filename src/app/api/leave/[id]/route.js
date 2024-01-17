import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Shift from "@/models/shift";
import TimeOffRequest from "@/models/timeOffRequest";
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

    const leave = await TimeOffRequest.findById(id)

    leave.set({
      ...body
    })

    await leave.save();

    return new NextResponse(JSON.stringify(leave), { status: 200 });
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

    await Shift.findByIdAndDelete(id);

    await Employee.updateOne({
      $pull: {
        shifts: id
      }
    })

    return new NextResponse("Shift has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};