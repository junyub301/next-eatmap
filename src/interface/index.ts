export interface StoreType {
    id: number;
    phone?: string | null;
    address?: string | null;
    lat?: string | null;
    lng?: string | null;
    name?: string | null;
    category?: string | null;
    storeType?: string | null;
    foodCertifyName?: string | null;
    likes?: Like[];
}

export interface Like {
    id: number;
    storeId: number;
    userId: number;
    store?: StoreType;
}

export interface LikeApiResponse {
    data: Like[];
    totalPage?: number;
    page?: number;
}
export interface StoreApiResponse {
    data: StoreType[];
    totalPage?: number;
    totalCount?: number;
    page?: number;
}

export interface LocationType {
    lat?: string | null;
    lng?: string | null;
    zoom?: number | null;
}

export interface SearchType {
    q?: string;
    district?: string;
}
