import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Schedule from "@/models/schedule";
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

    const schedule = await Schedule.findById(id)

    schedule.set({
      ...body
    })

    await schedule.save();

    return new NextResponse(JSON.stringify(schedule), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
}

export const DELETE = async (_, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }
  const { id } = params;

  try {
    await connect();

    await Schedule.findByIdAndDelete(id);

    return new NextResponse("Schedule has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};