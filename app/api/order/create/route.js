import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items } = await request.json()
        console.log('items', items)
        if (!address || items.length == 0) {
            return NextResponse.json({ success: false, error: "Invalid Data" })
        }
        const amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.productId)
            return await acc + product.offerPrice * item.quantity
        }, 0)
        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02),
                date: Date.now()
            }
        })
        // clear user cart
        const user = await User.findById(userId)
        user.cartItems = []
        await user.save()
        return NextResponse.json({ success: true, message: "Order Placed" })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message })
    }
}
