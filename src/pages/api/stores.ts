import { PrismaClient } from "@prisma/client";
import { StoreApiResponse, StoreType } from "@/interface";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType>
) {
    const { page = "" }: { page?: string } = req.query;
    const prisma = new PrismaClient();

    if (page) {
        const count = await prisma.store.count();
        const skipPage = parseInt(page) - 1;
        const stores = await prisma.store.findMany({
            orderBy: { id: "asc" },
            take: 10,
            skip: skipPage * 10,
        });

        res.status(200).json({
            page: parseInt(page),
            data: stores,
            totalCount: count,
            totalPage: count / 10,
        });
    } else {
        const { id }: { id?: string } = req.query;
        const stores = await prisma.store.findMany({
            orderBy: { id: "asc" },
            where: {
                id: id ? parseInt(id) : {},
            },
        });
        return res.status(200).json(id ? stores[0] : stores);
    }
}
