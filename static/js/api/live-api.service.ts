


import { get, post } from "../utils/http.util";

const BASE_URL = 'https://live-api.degencoinflip.com/api/';
const DEFAULT_PROMO_ID = '90199dd0-bf79-4cc1-a5da-3c3647c85615';

export const getJackpotPromotion = async () => {
    const url = `${BASE_URL}/promos/jackpots`
    const response = await get(url);
    return response;
}

export const getJackpotEligibility = async (walletId: any, promoId: string = DEFAULT_PROMO_ID) => {
    const url = `${BASE_URL}promos/check-eligibility?clientId=dcf`
    const response = await post(url, { walletId, promoId });
    return response?.data;
}