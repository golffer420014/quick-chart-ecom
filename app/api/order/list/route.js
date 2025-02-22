import connectDB from "@/config/db"
import Address from "@/models/Address"
import Order from "@/models/Order"
import Product from "@/models/Product"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        await connectDB()


        const orders = await Order.find({ userId }).populate("address items.productId")
        return NextResponse.json({ success: true, orders })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message })
    }
}

