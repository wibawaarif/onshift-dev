import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Shift from "@/models/shift";
import Employee from "@/models/employee";
import Location from "@/models/location";
import Position from "@/models/position";
import { verifyJwtToken } from '@/lib/jwt'

export const GET = async (request) => {
  const accessToken = request.headers.get("authorization")
  const token = accessToken?.split(' ')[1]
  const workspace = accessToken?.split(' ')[2]

  const decodedToken = verifyJwtToken(token)  


  if (!accessToken || !decodedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const shifts = await Shift.find({workspace}).populate({ path: 'location', select: 'name', model: Location }).populate({ path: 'position', select: 'name', model: Position })

    return new NextResponse(JSON.stringify(shifts), { status: 200 });
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

  const newShift = new Shift({...body, user: decodedToken.email});

  try {
    await connect();

    await newShift.save();

    if (body.employees.length > 0) {
      for (let i=0; i < body.employees.length; i++) {
        const findEmployee = await Employee.findOne({user: decodedToken.email, _id: body.employees[i]})
        let newEmployees;
  
        if (findEmployee.shifts) {
          newEmployees = [...findEmployee.shifts, newShift._id]
        } else {
          newEmployees = [newShift._id]
        }
  
        findEmployee.set({
          ...findEmployee,
          shifts: newEmployees,
        })
  
        await findEmployee.save();
      }
    }

    return new NextResponse(JSON.stringify(newShift), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};