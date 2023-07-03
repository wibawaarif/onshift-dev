import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Employee from "@/models/employee";

export const GET = async (request) => {
  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const employees = await Employee.find({}).populate('role', 'name').populate('position', 'name').populate('location', 'name latitude longitude')

    return new NextResponse(JSON.stringify(employees), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const POST = async (request) => {
  const body = await request.json();

  const newEmployee = new Employee(body);

  try {
    await connect();

    await newEmployee.save();

    return new NextResponse(JSON.stringify(newEmployee), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};