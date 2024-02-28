import { searchState } from "@/atom";
import Loader from "@/components/Loader";
import Loading from "@/components/Loading";
import SearchFilter from "@/components/SearchFilter";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { StoreType } from "@/interface";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { useRecoilValue } from "recoil";

export default function StoreListPage() {
    const ref = useRef<HTMLDivElement | null>(null);
    const pageRef = useIntersectionObserver(ref, {});
    const isPageEnd = !!pageRef?.isIntersecting;
    const router = useRouter();
    const searchValue = useRecoilValue(searchState);

    const searchParams = searchValue;

    const fetchStores = async ({ pageParam = 1 }) => {
        const { data } = await axios(`/api/stores?page=${pageParam}`, {
            params: {
                limit: 10,
                pag: pageParam,
                ...searchParams,
            },
        });

        return data;
    };

    const {
        data: stores,
        isError,
        isLoading,
        isFetching,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteQuery(["stores", searchParams], fetchStores, {
        getNextPageParam: (lastPage: any) =>
            lastPage.data?.length > 0 ? lastPage.page + 1 : undefined,
    });

    const fetchNext = useCallback(async () => {
        const res = await fetchNextPage();
        if (res.isError) {
            console.error(res.error);
        }
    }, [fetchNextPage]);

    useEffect(() => {
        let timerId: NodeJS.Timeout | undefined;
        if (isPageEnd && hasNextPage) {
            timerId = setTimeout(() => {
                fetchNext();
            }, 500);
        }
        return () => clearTimeout(timerId);
    }, [isPageEnd, fetchNext, hasNextPage]);

    if (isError) {
        return (
            <div className="W-FULL h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold">
                다시 시도해주세요.
            </div>
        );
    }

    return (
        <div className="px-4 md:max-w-5xl mx-auto py-8">
            <SearchFilter />
            {isLoading ? (
                <Loading />
            ) : (
                <ul role="list" className="divide-y divide-gray-100">
                    {stores?.pages.map((page, index) =>
                        page.data.map((store: StoreType, i: number) => (
                            <li
                                className="flex justify-between gap-x-6 py-5 cursor-pointer hover:bg-gray-50"
                                key={i}
                                onClick={() => router.push(`/stores/${store.id}`)}
                            >
                                <div className="flex gap-x-4">
                                    <Image
                                        src={
                                            store?.category
                                                ? `/images/markers/${store.category}.png`
                                                : "/images/markers/default.png"
                                        }
                                        alt="아이콘 이미지"
                                        width={48}
                                        height={48}
                                    />
                                    <div>
                                        <div className="text-sm font-semibold leading-9 text-gray-900">
                                            {store.name}
                                        </div>
                                        <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                                            {store.storeType}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex sm:flex-col sm:items-end">
                                    <div className="text-sm font-semibold leading-9 text-gray-900">
                                        {store.address}
                                    </div>
                                    <div className="mt-1 text-xs truncate font-semibold leading-5 text-gray-500">
                                        {store.phone || "번호없음"} | {store.foodCertifyName} |{" "}
                                        {store.category}
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
            {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
            <div className="w-full touch-none h-10 mb-10 " ref={ref} />
        </div>
    );
}
