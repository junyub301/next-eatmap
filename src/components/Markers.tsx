import { currentStoreState, locationState, mapState } from "@/atom";
import { StoreType } from "@/interface";
import { SetStateAction, useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

interface MarkersProps {
    stores: StoreType[];
}
export default function Markers({ stores }: MarkersProps) {
    const map = useRecoilValue(mapState);
    const setCurrentStore = useSetRecoilState(currentStoreState);
    const [location, setLocation] = useRecoilState(locationState);
    const loadKakaoMarkers = useCallback(() => {
        stores?.map((store) => {
            const imageSrc = store.category
                    ? `/images/markers/${store?.category}.png`
                    : "/images/markers/default.png",
                imageSize = new window.kakao.maps.Size(40, 40),
                imageOption = { offset: new window.kakao.maps.Point(27, 69) };

            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                markerPosition = new window.kakao.maps.LatLng(store.lat, store.lng);

            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
            });

            marker.setMap(map);

            const content = `<div class="infowindow">${store.name}</div>`;

            const customOverlay = new window.kakao.maps.CustomOverlay({
                position: markerPosition,
                content: content,
                xAnchor: 0.6,
                yAnchor: 0.91,
            });

            window.kakao.maps.event.addListener(marker, "mouseover", function () {
                customOverlay.setMap(map);
            });

            window.kakao.maps.event.addListener(marker, "mouseout", function () {
                customOverlay.setMap(null);
            });

            window.kakao.maps.event.addListener(marker, "click", function () {
                setCurrentStore(store);
                setLocation({
                    ...location,
                    lat: store.lat,
                    lng: store.lng,
                });
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map, stores]);
    useEffect(() => {
        if (map) {
            loadKakaoMarkers();
        }
    }, [loadKakaoMarkers, map]);
    return <div>Markers</div>;
}
