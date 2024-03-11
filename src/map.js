import React, { useEffect } from 'react';

const MapComponent = () => {
    useEffect(() => {
        // Kakao Maps 초기화 및 사용하는 코드 작성.
        const container = document.getElementById('map');
        const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
        };
        const map = new window.kakao.maps.Map(container, options);
    }, []);

    return (
        <div id="map" style={{ width: '500px', height: '400px' }}></div>
    );
};

export default MapComponent;