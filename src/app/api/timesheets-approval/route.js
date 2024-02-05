import { NextResponse } from "next/server";
import connect from "@/utils/db";
import TimesheetApproval from "@/models/timesheetApproval";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const GET = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  try {
    await connect();

    const timesheetApprovals = await TimesheetApproval.find({}).populate('timesheet');

    return new NextResponse(JSON.stringify(timesheetApprovals), { status: 200 });
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

  const newTimesheetApproval = new TimesheetApproval(body);

  try {
    await connect();

    await newTimesheetApproval.save();

    return new NextResponse(JSON.stringify(newTimesheetApproval), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};