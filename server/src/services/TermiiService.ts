import axios, { AxiosInstance } from "axios";
import settings from "../config/settings";

export interface IRequestOTResponse {
  pinId: string;
  to: string;
  smsStatus: string;
}

export interface IVerifyOTPResponse {
  pinId: string;
  verified: string;
  msisdn: string;
}

export interface SendMessageRequest {
  to: string;
  sms: string;
  type: "plain";
  channel: "dnd" | "whatsapp" | "generic";
}

class TermiiService {
  private Axios!: AxiosInstance;
  constructor() {
    this.Axios = axios.create({
      baseURL: settings.termii.host,
      headers: { "Accept-Encoding": "gzip,deflate,compress" },
    });
  }
  async sendOtp(phoneNumber: string): Promise<IRequestOTResponse> {
    phoneNumber =
      phoneNumber.charAt(0) == "0"
        ? `234${phoneNumber.substring(1, phoneNumber.length)}`
        : phoneNumber;
    const response = await this.Axios.post("/api/sms/otp/send", {
      api_key: settings.termii.key,
      message_type: "NUMERIC",
      to: phoneNumber,
      from: settings.termii.from,
      channel: "dnd",
      pin_attempts: 1,
      pin_time_to_live: 30,
      pin_length: 6,
      pin_placeholder: "< 123456 >",
      message_text:
        "Your HyveTech code is < 123456 >. It expires in 30 minutes.",
      pin_type: "NUMERIC",
    });
    return response.data as IRequestOTResponse;
  }

  async verifyOtp(pinId: string, pin: string): Promise<IVerifyOTPResponse> {
    const response = await this.Axios.post("/api/sms/otp/verify", {
      api_key: settings.termii.key,
      pin_id: pinId,
      pin,
    });
    return response.data as IVerifyOTPResponse;
  }

  async sendMessage(payload: SendMessageRequest) {
    try {
      payload.to =
        payload.to.charAt(0) == "0"
          ? `234${payload.to.substring(1, payload.to.length)}`
          : payload.to;
      const response = await this.Axios.post("/api/sms/send", {
        ...payload,
        from: settings.termii.from,
        api_key: settings.termii.key,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default TermiiService;
