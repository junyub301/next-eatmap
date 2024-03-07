import CurrentLocationButton from "@/components/CurrentLocationButton";
import Map from "@/components/Map";
import Markers from "@/components/Markers";
import StoreBox from "@/components/StoreBox";
import { StoreType } from "@/interface";
import axios from "axios";
import { useState } from "react";

export default function Home({ stores }: { stores: StoreType[] }) {
    return (
        <>
            <Map />
            <Markers stores={stores} />
            <StoreBox />
            <CurrentLocationButton />
        </>
    );
}

export async function getServerSideProps() {
    const { data: stores } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
    return {
        props: { stores },
    };
}
