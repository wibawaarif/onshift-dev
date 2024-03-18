import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Employee from "@/models/employee";
import Location from "@/models/location";
import Shift from "@/models/shift";
import Position from "@/models/position";
import bcrypt from 'bcrypt'
import Timesheet from "@/models/timesheet";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";
import { Vonage } from "@vonage/server-sdk"

const from = "Vonage APIs"
const to = "6285363480277"

const vonage = new Vonage({
  apiKey: "5b3aceb4",
  apiSecret: "4LOTXUO2mYVyDROX"
})

async function sendSMS(text) {
  await vonage.sms.send({to, from, text})
      .then(resp => { console.log('Message sent successfully'); console.log(resp); })
      .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

export const GET = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { workspace } = session.user

  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const employees = await Employee.find({user: session.user.email, workspace}).sort({ createdAt: -1 })
    .populate({
      path: 'shifts',
      model: Shift,
      select: 'date startTime endTime location position repeatedShift',
      populate: {
        path: 'location',
        model: Location,
        select: 'name '
      }
    }).select("name shifts status")

    return new NextResponse(JSON.stringify(employees), { status: 200 });
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
  console.log(body)

  const findExistingEmployee = await Employee.findOne({email: body.email})

  if (findExistingEmployee) {
    return new Response(JSON.stringify({ error: `${body.email} already existed`, info: "email existed" }), { status: 400 })
  }

  let newEmployee;

  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10)
    newEmployee = new Employee({...body, password: hashedPassword, user: session.user.email});
  } else {
    newEmployee = new Employee({...body, user: session.user.email});
  }

  try {
    await connect();

    await newEmployee.save();

    sendSMS(`A Manager has been created your account with the following: \n\n Email: ${body.email} \n Password: ${body.password}`);

    return new NextResponse(JSON.stringify(newEmployee), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};