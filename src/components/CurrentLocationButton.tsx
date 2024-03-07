import { mapState } from "@/atom";
import { useState } from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { FaLastfmSquare } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import FullPageLoader from "./FullPageLoader";
export default function CurrentLocationButton() {
    const map = useRecoilValue(mapState);
    const [loading, setLoading] = useState<boolean>(false);
    const handleCurrentPosition = () => {
        setLoading(true);

        const options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: Infinity,
        };
        if (navigator.geolocation && map) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const currentPosition = new window.kakao.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    if (currentPosition) {
                        setLoading(false);
                        map.panTo(currentPosition);
                        toast.success("현재 위치로 이동");
                    }
                    return currentPosition;
                },
                () => {
                    toast.error("현재 위치를 가져올 수 없습니다.");
                    setLoading(false);
                },
                options
            );
        }
    };
    return (
        <>
            {loading && <FullPageLoader />}
            <button
                type="button"
                onClick={handleCurrentPosition}
                className="fixed z-10 p-2 shadow right-10 bg-white bottom-20 rounded-md hover:shadow-lg focus:shadow-lg hover:bg-blue-100"
            >
                <BiCurrentLocation className="w-5 h-5" />
            </button>
        </>
    );
}