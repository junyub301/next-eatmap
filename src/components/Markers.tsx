import { SetStateAction, useCallback, useEffect } from "react";

interface MarkersProps {
    map: any;
    stores: any[];
    setCurrentStore: React.Dispatch<SetStateAction<any>>;
}
export default function Markers({ map, stores, setCurrentStore }: MarkersProps) {
    const loadKakaoMarkers = useCallback(() => {
        stores?.map((store) => {
            const imageSrc = store.bizcnd_code_nm
                    ? `/images/markers/${store?.bizcnd_code_nm}.png`
                    : "/images/markers/default.png",
                imageSize = new window.kakao.maps.Size(40, 40),
                imageOption = { offset: new window.kakao.maps.Point(27, 69) };

            const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                markerPosition = new window.kakao.maps.LatLng(store.y_dnts, store.x_cnts);

            const marker = new window.kakao.maps.Marker({
                position: markerPosition,
                image: markerImage,
            });

            marker.setMap(map);

            const content = `<div class="infowindow">${store.upso_nm}</div>`;

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
            });
        });
    }, [map, setCurrentStore, stores]);
    useEffect(() => {
        if (map) {
            loadKakaoMarkers();
        }
    }, [loadKakaoMarkers, map]);
    return <div>Markers</div>;
}
