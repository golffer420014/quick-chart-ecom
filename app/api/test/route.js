import connectDB from "@/config/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
export async function GET(req, res) {
    // await connectDB();
    // await User.create({
    //     _id: "1",
    //     email: "test@test.com",
    //     name: "Test User",
    //     imageUrl: "https://example.com/image.png",
    //     cartItems: {},
    // });
    return NextResponse.json({ message: "Hello, world!" });
}
