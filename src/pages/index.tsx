import Map from "@/components/Map";
import Markers from "@/components/Markers";
import StoreBox from "@/components/StoreBox";
import * as stores from "@/data/store_data.json";
import { StoreType } from "@/interface";
import axios from "axios";
import { useState } from "react";

export default function Home({ stores }: { stores: StoreType[] }) {
    const [map, setMap] = useState(null);
    const [currentStore, setCurrentStore] = useState<StoreType | null>(null);
    return (
        <>
            <Map setMap={setMap} />
            <Markers stores={stores} map={map} setCurrentStore={setCurrentStore} />
            <StoreBox store={currentStore} setStore={setCurrentStore} />
        </>
    );
}

export async function getStaticProps() {
    const { data: stores } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
    return {
        props: { stores },
        revalidate: 60 * 60,
    };
}
