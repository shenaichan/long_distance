type PinOut = {
    latitude:number
    longitude:number
    place_name:string | null
}

type MessageOut = {
    sender:number
    senderPW:string
    recipient:number
    recipientPW:string
    message:string
}

type ResponseOut = {
    sender:number
    recipient:number
    replyPW:string
    message:string
}

export type PinInPrivate = {
    id: number;
    latitude: number;
    longitude: number;
    place_name: string;
    public_share_token: string;
    private_ownership_token: string;
    private_allow_mail_token: string;
}

export type PinInPublic = {
    id: number;
    latitude: number;
    longitude: number;
    place_name: string;
    public_share_token: string;
}

export type PinInFriend = {
    id: number;
    private_allow_mail_token: string;
}

export type MessageInPrivate = {
    sender:PinInPublic
    recipient:PinInPrivate
    message:string
    response:string | null
}

export type MessageInPublic = {
    sender:PinInPublic
    recipient:PinInPublic
    message:string
    response:string | null
}

export type InventoryMessageIn = {
    sender_id:number
    recipient_id:number
    content:string
}



const BASE_URL = `${import.meta.env.VITE_API_URL}api/`
console.log(BASE_URL)



export async function checkIfMapLoadAllowed() {
    const mapAllowedResponse = await fetch(
        `${BASE_URL}check_if_map_load_allowed`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    const mapAllowed = await mapAllowedResponse.json()
    return mapAllowed as boolean
}

export async function checkIfGeolocateAllowed() {
    const geolocateAllowedResponse = await fetch(
        `${BASE_URL}check_if_geolocate_allowed`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    const geolocateAllowed = await geolocateAllowedResponse.json()
    return geolocateAllowed as boolean
}

export async function getAllMyMessageThreads(sender_ids: number[]) {
    const messagesResponse = await fetch(
        `${BASE_URL}get_all_my_message_threads`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sender_ids)
        })
    const messages = await messagesResponse.json()
    return messages as InventoryMessageIn[][]
}

export async function getMessageThreadBySecret(secret: string) {
    const messageThreadResponse = await fetch(
        `${BASE_URL}get_message_thread_by_secret?secret=${secret}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const messageThread = await messageThreadResponse.json()
    console.log(messageThread)
    return messageThread as MessageInPrivate
}

export async function getSecretReplyLink(sender: number, senderPW: string, recipient: number) {
    const replyLinkResponse = await fetch(
        `${BASE_URL}get_secret_reply_link?sender=${sender}&senderPW=${senderPW}&recipient=${recipient}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const replyLink = await replyLinkResponse.json()
    console.log(replyLink)
    return replyLink as string
}

export async function canWriteResponse(secret: string) {
    const canReplyResponse = await fetch(
        `${BASE_URL}can_write_response?secret=${secret}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const canReply = await canReplyResponse.json()
    console.log(canReply)
    return canReply as boolean
}

export async function checkIfMessageIsSafe(message: string) {
    const messageSafetyResponse = await fetch(
        `${BASE_URL}check_if_message_is_safe?content=${message}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const messageSafety = await messageSafetyResponse.json()
    console.log(messageSafety)
    return messageSafety as boolean
}

export async function checkIfRelationshipExists(sender: number, recipient: number) {
    const relationshipExistsResponse = await fetch(
        `${BASE_URL}check_if_relationship_exists?sender=${sender}&recipient=${recipient}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const relationshipExists = await relationshipExistsResponse.json()
    console.log(relationshipExists)
    return relationshipExists as boolean
}

export async function getMessageThread(sender_id: number, recipient_id: number) {
    const messageThreadResponse = await fetch(
        `${BASE_URL}get_message_thread?sender_id=${sender_id}&recipient_id=${recipient_id}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const messageThread = await messageThreadResponse.json()
    console.log(messageThread)
    return messageThread as MessageInPublic
}

export async function getPinByFriendCode(friend_code: string) {
    const pinResponse = await fetch(
        `${BASE_URL}get_pin_by_friend_code?friend_code=${friend_code}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const pin = await pinResponse.json()
    return pin as PinInPublic
}

export async function getPinByPublicToken(public_token: string) {
    const pinResponse = await fetch(
        `${BASE_URL}get_pin_by_public_token?public_token=${public_token}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const pin = await pinResponse.json()
    return pin as PinInPublic
}

export async function getPinByPrivateToken(private_token: string) {
    const pinResponse = await fetch(
        `${BASE_URL}get_pin_by_private_token?private_token=${private_token}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const pin = await pinResponse.json()
    return pin as PinInPrivate
}

export async function getRelationshipsStarted(public_token: string) {
    const relationshipsStartedResponse = await fetch(
        `${BASE_URL}get_relationships_started?public_token=${public_token}`, 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
    const relationshipsStarted = await relationshipsStartedResponse.json()
    return relationshipsStarted as PinInPublic[]
}

export async function getRelationshipsFinished(public_token: string) {
    const relationshipsFinishedResponse = await fetch(
        `${BASE_URL}get_relationships_finished?public_token=${public_token}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    const relationshipsFinished = await relationshipsFinishedResponse.json()
    return relationshipsFinished as PinInPublic[]
}

export async function getNumKM() {
    const numKmResponse = await fetch(
        `${BASE_URL}get_num_km`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    const numKm = await numKmResponse.json()
    return numKm as number
}

export async function createRelationshipAndMessage(message: MessageOut) {
    const secretLinkResponse = await fetch(
        `${BASE_URL}create_relationship_and_message`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        }
    )
    const secretLink = await secretLinkResponse.json()
    return secretLink as string
}

export async function createAndAddResponse(message: ResponseOut) {
    await fetch(
        `${BASE_URL}create_and_add_response`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        }
    )
}

export async function createFriendPin(pin: PinOut) {
    const createdPinResponse = await fetch(
        `${BASE_URL}create_friend_pin`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pin)
        }
    )
    const createdPin = await createdPinResponse.json()
    return createdPin as PinInFriend
}

export async function createApproveClaimPin(pin: PinOut) {
    const createdPinResponse = await fetch(
        `${BASE_URL}create_approve_claim_pin`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pin)
        }
    )
    const createdPin = await createdPinResponse.json()
    return createdPin as PinInPrivate
}

import { FeatureCollection } from 'geojson';

export async function getApprovedPins() {
    const approvedPinsResponse = await fetch(
        `${BASE_URL}get_approved_pins`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    const approvedPins = await approvedPinsResponse.json()
    return approvedPins as FeatureCollection
}

export async function getApprovedRoutes() {
    const approvedRoutesResponse = await fetch(
        `${BASE_URL}get_approved_routes`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    const approvedRoutes = await approvedRoutesResponse.json()
    return approvedRoutes as FeatureCollection
}

export async function getPlaceName(latitude: number, longitude: number) {
    await fetch(
        `${BASE_URL}add_geolocate`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    const accessToken = import.meta.env.VITE_MAPBOX_KEY;
    const placeResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}&limit=1`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    const place = await placeResponse.json()
    try {
        const placeName = place.features[0].place_name
        return placeName as string
    }
    catch {
        console.log("in error case")
        return "nowhere in particular"
    }
}

