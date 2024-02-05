import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Employee from "@/models/employee";
import bcrypt from 'bcrypt'
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const PUT = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }


  const { id } = params;
  const body = await request.json();

  try {
    await connect();
    console.log(body)
    if (body?.method === "resetPassword") {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      const employee = await Employee.findById(id)

      employee.set({
        ...body,
        password: hashedPassword
      })
      
      await employee.save();
      return new NextResponse(JSON.stringify(employee), { status: 200 });
    } else {
      console.log('masuk sni')
      const employee = await Employee.findById(id)

      employee.set({
        ...body
      })
  
      await employee.save();
  
      return new NextResponse(JSON.stringify(employee), { status: 200 });
    }


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

    await Employee.findByIdAndDelete(id);

    return new NextResponse("Employee has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};