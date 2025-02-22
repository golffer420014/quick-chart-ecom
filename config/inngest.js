import User from "@/models/User";
import connectDB from "@/config/db";
import { Inngest } from "inngest";
import Order from "@/models/Order";


export const inngest = new Inngest({ id: "quickcart-next" });

// inngest fnc to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        };

        await connectDB();
        await User.create(userData);
    }
);


// inngest fnc to update user data to a database
export const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        };

        await connectDB();
        await User.findOneAndUpdate({ _id: id }, userData, { new: true });
    }
);


// inngest fnc to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await connectDB();
        await User.deleteMany({ _id: id });
    }
);


// inngest fnc to create user's order in database
export const createUserOrder = inngest.createFunction(
    {
        id: "create-user-order",
        batchEvents: {
            maxSize: 30,
            timeout: "5s"
        }
    },
    { event: "order/created" },
    async ({ events }) => {
        const orders = events.map((event) => {
            return {
                userId: event.data.userId,
                items: event.data.items,
                amount: event.data.amount,
                address: event.data.address,
                date: event.data.date
            }
        })

        await connectDB()
        await Order.insertMany(orders)

        return {
            success: true,
            processed: orders.length
        }
        // send email to user
        // await inngest.send({
        //     name: "send-order-confirmation-email",
        //     data: {
        //         userId: orders[0].userId,
        //         orderId: orders[0].id
        //     }
        // })
    }
)
