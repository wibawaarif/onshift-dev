import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Timesheet from "@/models/timesheet";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const PUT = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { id } = params;
  const body = await request.json();

  const findExistedTimesheet = await Timesheet.findOne({user: session.user.email, name: body.name})

  if (findExistedTimesheet && String(findExistedTimesheet._id) !== id) {
    return new NextResponse(JSON.stringify({error: "Timesheet already exists"}), { status: 400 });
  }

  try {
    await connect();

    const timesheet = await Timesheet.findById(id)

    timesheet.set({
      ...body
    })

    await timesheet.save();

    return new NextResponse(JSON.stringify(timesheet), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
}