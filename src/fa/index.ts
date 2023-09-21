import { fetch as tauriFetch, ResponseType as TauriResponseType } from '@tauri-apps/api/http';
import * as cheerio from "cheerio";

export default class FurAffinityAccount {
    private BASE_URI = "https://www.furaffinity.net"

    private cookies: {
        a: string,
        b: string
    }
    
    constructor(cookies: {a: string, b: string}) {
        this.cookies = cookies;
    }

    public async get(url: string): Promise<any> {
        const res = await tauriFetch<string>(this.BASE_URI + url, {
            method: "GET",
            responseType: TauriResponseType.Text,
            headers: {
                Cookie: `a=${this.cookies.a}; b=${this.cookies.b}`
            }
        });

        if (res.ok) {
            return cheerio.load(res.data);
        } else {
            throw new FAHttpError("Something happened", res.status, "BAD_HTTP_RESPONSE", res);
        }
    }
}