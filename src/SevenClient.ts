import {getConfig} from '@evershop/evershop/lib/util/getConfig'
import {info} from '@evershop/evershop/lib/log'

export default class SevenClient {
    readonly apiUrl = 'https://gateway.seven.io/api'
    readonly headers: {
        Accept: string
        'Content-Type': string
        SentWith: string
        'X-Api-Key': string
    }

    constructor() {
        this.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            SentWith: 'EverShop',
            'X-Api-Key': getConfig('seven.apiKey', '')
        }
    }

    async sms(body: Record<string, any>) {
        if (!body.from) body.from = getConfig('seven.from', '')

        const res = await fetch(`${this.apiUrl}/sms`, {
            body: JSON.stringify(body),
            headers: this.headers,
            method: 'POST',
        })
        const json = await res.json()
        info(json)
        return json
    }
}
