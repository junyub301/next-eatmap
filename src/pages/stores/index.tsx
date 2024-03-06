import { searchState } from "@/atom";
import Loader from "@/components/Loader";
import Loading from "@/components/Loading";
import SearchFilter from "@/components/SearchFilter";
import StoreList from "@/components/StoreList";
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
                            <StoreList key={store.id} store={store} i={i} />
                        ))
                    )}
                </ul>
            )}
            {(isFetching || hasNextPage || isFetchingNextPage) && <Loader />}
            <div className="w-full touch-none h-10 mb-10 " ref={ref} />
        </div>
    );
}
