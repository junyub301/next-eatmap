import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { Adapter } from "next-auth/adapters";

const prisma = new PrismaClient();

export const authOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: "test",
            clientSecret: "test",
        }),
    ],
};

export default NextAuth(authOptions);
