import Chat from "../../../../models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "../../../../config/db";

export async function POST(req){
    try{
        const {userId}=getAuth(req);

        if(!userId){
            return NextResponse.json({
                success:false,
                message: "User not authenticated",
            });
        }


        const {chatId,name} = await req.json();
        //connect to the database and update the chat name
        await connectDB();
        await Chat.findOneAndUpdate({_id: chatId, userId},{name});
        return NextResponse.json({success: true,message: "CHat Renamed"});
    }catch(error){
        return NextResponse.json({success: false,error: error.message});

    }
}

