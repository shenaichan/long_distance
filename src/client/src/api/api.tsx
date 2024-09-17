type PinOut = {
    latitude:number
    longitude:number
    place_name:string | null
}

type MessageOut = {
    sender:number
    recipient:number
    message:string
}

type PinIn = {
    latitude:number
    longitude:number
    place_name:string
    public_share_token:string
}

export async function getNumKM() {
    return fetch('http://127.0.0.1:8000/api/get_num_km', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Token ${localStorage.getItem('token')}`       
        },
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            return result as number;
        });
}


export async function createPin(pin: PinOut) {
    fetch('http://127.0.0.1:8000/api/create_pin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pin),
    })
        .then(response => response.json())
        .then(result => console.log(result));
}

export async function createApproveClaimPin(pin: PinOut) {
    fetch('http://127.0.0.1:8000/api/create_approve_claim_pin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(pin),
    })
        .then(response => response.json())
        .then(result => console.log(result));
}

import { FeatureCollection } from 'geojson';

export async function getApprovedPins(): Promise<FeatureCollection> {
    return fetch('http://127.0.0.1:8000/api/get_approved_pins', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Token ${localStorage.getItem('token')}`
        },
    })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            return result as FeatureCollection;
        });
}


export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
    const accessToken = import.meta.env.VITE_MAPBOX_KEY;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}&limit=1`;

    return fetch(url)
        .then(response => response.json())
        .then(result => {
            const placeName = result.features[0].place_name;
            return placeName;   
        })
        .catch(error => {
            console.error('Error with reverse geocoding:', error); 
            return "nowhere in particular";
        });
}

