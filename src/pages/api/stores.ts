import { authOptions } from "./auth/[...nextauth]";
import { StoreApiResponse, StoreType } from "@/interface";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/db/index";
import axios from "axios";
import { getServerSession } from "next-auth";

interface ResponseType {
    page?: string;
    limit?: string;
    q?: string;
    district?: string;
    id?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<StoreApiResponse | StoreType[] | StoreType | null>
) {
    const { page = "", limit = "", q, district, id }: ResponseType = req.query;
    const session = await getServerSession(req, res, authOptions);
    if (req.method === "POST") {
        const formData = req.body;
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        };
        const { data } = await axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
                formData.address
            )}`,
            { headers }
        );
        const result = await prisma.store.create({
            data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
        });
        return res.status(200).json(result);
    } else if (req.method === "PUT") {
        const formData = req.body;
        const headers = {
            Authorization: `KakaoAK ${process.env.KAKAO_CLIENT_ID}`,
        };
        const { data } = await axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURI(
                formData.address
            )}`,
            { headers }
        );
        const result = await prisma.store.update({
            data: { ...formData, lat: data.documents[0].y, lng: data.documents[0].x },
            where: {
                id: formData.id,
            },
        });
        return res.status(200).json(result);
    } else if (req.method === "DELETE") {
        if (id) {
            const result = await prisma.store.delete({
                where: { id: parseInt(id) },
            });
            return res.status(200).json(result);
        } else {
            return res.status(500).json(null);
        }
    } else {
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
                include: {
                    likes: {
                        where: session ? { userId: +session.user.id } : {},
                    },
                },
            });
            return res.status(200).json(id ? stores[0] : stores);
        }
    }
}
