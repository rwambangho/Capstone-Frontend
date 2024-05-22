import React, { useEffect, useState } from "react";

const { kakao } = window;

const Kakao = () => {
    const [departurePlaces, setDeparturePlaces] = useState([]);
    const [arrivalPlaces, setArrivalPlaces] = useState([]);
    const [selectedDeparturePlace, setSelectedDeparturePlace] = useState({ name: "", address: "", x: "", y: "" });
    const [selectedArrivalPlace, setSelectedArrivalPlace] = useState({ name: "", address: "", x: "", y: "" });

    const ps = new kakao.maps.services.Places();

    useEffect(() => {
        // 초기 검색 없음
    }, []);

    const searchDeparturePlaces = (keyword) => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            return false;
        }

        ps.keywordSearch(keyword, departurePlacesSearchCB);
    };

    const departurePlacesSearchCB = (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const mappedPlaces = data.map(place => ({
                name: place.place_name,
                address: place.address_name,
                x: place.x,
                y: place.y
            }));
            setDeparturePlaces(mappedPlaces);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
        }
    };

    const searchArrivalPlaces = (keyword) => {
        if (!keyword.replace(/^\s+|\s+$/g, '')) {
            return false;
        }

        ps.keywordSearch(keyword, arrivalPlacesSearchCB);
    };

    const arrivalPlacesSearchCB = (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const mappedPlaces = data.map(place => ({
                name: place.place_name,
                address: place.address_name,
                x: place.x,
                y: place.y
            }));
            setArrivalPlaces(mappedPlaces);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('검색 결과가 존재하지 않습니다.');
            return;
        } else if (status === kakao.maps.services.Status.ERROR) {
            alert('검색 결과 중 오류가 발생했습니다.');
            return;
        }
    };

    const handleDeparturePlaceClick = (place) => {
        setSelectedDeparturePlace(place);
        document.getElementById('departure').value=`${place.name}`;
    };

    const handleArrivalPlaceClick = (place) => {
        setSelectedArrivalPlace(place);
        document.getElementById('arrival').value=`${place.name}`;
    };

    const handleDepartureSubmit = (event) => {
        event.preventDefault();
        const keyword = document.getElementById('departure').value;
        searchDeparturePlaces(keyword);
    };

    const handleArrivalSubmit = (event) => {
        event.preventDefault();
        const keyword = document.getElementById('arrival').value;
        searchArrivalPlaces(keyword);
    };

    const handleSendButtonClick = async () => {
        if (selectedDeparturePlace && selectedArrivalPlace) {
            try {
                const response = await fetch('recruits/distance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        departureX: selectedDeparturePlace.x,
                        departureY: selectedDeparturePlace.y,
                        arrivalX: selectedArrivalPlace.x,
                        arrivalY: selectedArrivalPlace.y
                    })
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // handle successful response here
            } catch (error) {
                console.error('There was a problem with your fetch operation:', error);
            }
        } else {
            console.error('Please select both departure and arrival places.');
        }
    };

    


    return (
        <div>
            <form onSubmit={handleDepartureSubmit}>
                출발지: <input type="text" id="departure" size="15" />
                <button type="submit">검색하기</button>
            </form>

    
            <ul>
                {departurePlaces.map((place, index) => (
                    <li key={index} onClick={() => handleDeparturePlaceClick(place)}>
                        <strong>{place.name}</strong>: {place.address}
                    </li>
                ))}
            </ul>
          
            <form onSubmit={handleArrivalSubmit}>
                도착지: <input type="text" id="arrival" size="15" />
                <button type="submit">검색하기</button>
            </form>

      
            <ul>
                {arrivalPlaces.map((place, index) => (
                    <li key={index} onClick={() => handleArrivalPlaceClick(place)}>
                        <strong>{place.name}</strong>: {place.address}
                    </li>
                ))}
            </ul>

            <button onClick={handleSendButtonClick}>Send</button>

           
        </div>
    );
}

export default Kakao;
