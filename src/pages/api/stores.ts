import { StoreApiResponse, StoreType } from "@/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/index";
interface ResponseType {
    page?: string;
    limit?: string;
    q?: string;
    district?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType>
) {
    const { page = "", limit = "", q, district }: ResponseType = req.query;

    if (page) {
        const count = await prisma.store.count();
        const skipPage = parseInt(page) - 1;
        const stores = await prisma.store.findMany({
            orderBy: { id: "asc" },
            where: {
                name: q ? { contains: q } : {},
                address: district ? { contains: district } : {},
            },
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
