import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "@/db";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user) {
        return res.status(401);
    }

    if (req.method === "POST") {
        const { storeId }: { storeId: number } = req.body;

        let like = await prisma.like.findFirst({
            where: {
                storeId,
                userId: +session.user.id,
            },
        });

        if (like) {
            like = await prisma.like.delete({
                where: { id: like.id },
            });
            return res.status(204).json(like);
        } else {
            like = await prisma.like.create({
                data: {
                    storeId,
                    userId: +session.user.id,
                },
            });
            return res.status(201).json(like);
        }
    }
}
