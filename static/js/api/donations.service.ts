


import axios from "axios";
import { get, post } from "../utils/http.util";

// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://pol355ivn9.execute-api.us-east-1.amazonaws.com/prod';

export const getDonationPosts = async (filter = "SPONSOR") => {
  let url = `${BASE_URL}/donation-posts?filter=${filter}`;
  const response = await get(url);
  return response?.payload;
}

export const getDonations = async (limit = 12) => {
  let url = `${BASE_URL}/donations?limit=${limit}`;
  const response = await get(url);
  return response?.payload;
}



export const getTopDonations = async (startTime: string) => {
  let url = `${BASE_URL}/donations/top?startTime=${startTime}`;
  const response = await get(url);
  return response?.payload;
}


export const donate = async (walletId: string, amount: number, tx: any, message: string, twitter: any, hideAmount:any, profileImageUrl: string, nickname: string, Authorization: string) => {
  const url = `${BASE_URL}/donations`
  const { data } = await post(url, {
    walletId,
    amount,
    tx,
    hideAmount,
    message,
    twitter,
    profileImageUrl,
    nickname
  }, { Authorization });
  return data?.payload;
}