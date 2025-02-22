import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";

import { NextResponse } from "next/server";
import Address from "@/models/Address";


export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address } = await request.json()
        await connectDB()
        const newAddress = await Address.create({
            ...address,
            userId,
        })
        return NextResponse.json({ success: true, message: "Address added successfully", address: newAddress })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}