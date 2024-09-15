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

