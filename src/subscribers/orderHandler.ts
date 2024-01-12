import {info, error, debug, warning} from '@evershop/evershop/lib/log'
import {getConfig} from '@evershop/evershop/lib/util/getConfig'
import {SevenConfiguration} from '../bootstrap.js'
import {select} from '@evershop/postgres-query-builder'
import {pool} from '@evershop/evershop/lib/postgres'
import { provinces } from '@evershop/evershop/lib/locale/provinces'
import { countries } from '@evershop/evershop/lib/locale/countries'
import SevenClient from '../SevenClient.js'

export default function orderHandler<T extends keyof SevenConfiguration['events']>({event}: {event: T}){
    return  async function sendMessage(data) {
        info(`seven: sending message for event '${event}'`)

        try {
            const {enabled, text} = getConfig<SevenConfiguration['events'][T]>(`seven.events.${event}`)

            if (!enabled) {
                debug(`seven: sendMessage for event '${event}' stops as the event is not enabled`)
                return
            }
            if (!text) {
                debug(`seven: sendMessage for event '${event}' stops as the text is not set`)
                return
            }

            const order = await select()
                .from('order')
                .where('order_id', '=', data.order_id)
                .load(pool)

            if (!order) return

            const orderData = order
            order.items = await select()
                .from('order_item')
                .where('order_item_order_id', '=', order.order_id)
                .load(pool)

            orderData.shipping_address = await select()
                .from('order_address')
                .where('order_address_id', '=', order.shipping_address_id)
                .load(pool)

            orderData.shipping_address.country_name =
                countries.find(c => c.code === orderData.shipping_address.country)
                    ?.name || ''

            orderData.shipping_address.province_name =
                provinces.find(p => p.code === orderData.shipping_address.province)?.name || ''

            orderData.billing_address = await select()
                .from('order_address')
                .where('order_address_id', '=', order.billing_address_id)
                .load(pool)

            orderData.billing_address.country_name =
                countries.find(c => c.code === orderData.billing_address.country)
                    ?.name || ''

            orderData.billing_address.province_name =
                provinces.find(p => p.code === orderData.billing_address.province)?.name || ''

            const to = orderData.shipping_address.telephone ?? orderData.billing_address.telephone
            if (!to?.length) {
                warning(`seven: stop dispatching message for event '${event}' as no phone could be found`)
                return
            }

            const params = {
                text: text
                    .replaceAll('{{order_id}}', orderData.order_id)
                    .replaceAll('{{uuid}}', orderData.uuid)
                    .replaceAll('{{integration_order_id}}', orderData.integration_order_id)
                    .replaceAll('{{sid}}', orderData.sid)
                    .replaceAll('{{order_number}}', orderData.order_number)
                    .replaceAll('{{cart_id}}', orderData.cart_id)
                    .replaceAll('{{currency}}', orderData.currency)
                    .replaceAll('{{customer_id}}', orderData.customer_id)
                    .replaceAll('{{customer_email}}', orderData.customer_email)
                    .replaceAll('{{customer_full_name}}', orderData.customer_full_name)
                    .replaceAll('{{user_ip}}', orderData.user_ip)
                    .replaceAll('{{user_agent}}', orderData.user_agent)
                    .replaceAll('{{coupon}}', orderData.coupon)
                    .replaceAll('{{shipping_fee_excl_tax}}', orderData.shipping_fee_excl_tax)
                    .replaceAll('{{shipping_fee_incl_tax}}', orderData.shipping_fee_incl_tax)
                    .replaceAll('{{discount_amount}}', orderData.discount_amount)
                    .replaceAll('{{sub_total}}', orderData.sub_total)
                    .replaceAll('{{total_qty}}', orderData.total_qty)
                    .replaceAll('{{total_weight}}', orderData.total_weight)
                    .replaceAll('{{tax_amount}}', orderData.tax_amount)
                    .replaceAll('{{shipping_note}}', orderData.shipping_note)
                    .replaceAll('{{grand_total}}', orderData.grand_total)
                    .replaceAll('{{shipping_method}}', orderData.shipping_method)
                    .replaceAll('{{shipping_method_name}}', orderData.shipping_method_name)
                    .replaceAll('{{shipping_address_id}}', orderData.shipping_address_id)
                    .replaceAll('{{payment_method}}', orderData.payment_method)
                    .replaceAll('{{payment_method_name}}', orderData.payment_method_name)
                    .replaceAll('{{billing_address_id}}', orderData.billing_address_id)
                    .replaceAll('{{shipment_status}}', orderData.shipment_status)
                    .replaceAll('{{payment_status}}', orderData.payment_status)
                    .replaceAll('{{created_at}}', orderData.created_at)
                    .replaceAll('{{updated_at}}', orderData.updated_at)
                    .replaceAll('{{payment_method_name}}', orderData.payment_method_name)

                    .replaceAll('{{shipping_address.order_address_id}}', orderData.shipping_address.order_address_id)
                    .replaceAll('{{shipping_address.uuid}}', orderData.shipping_address.uuid)
                    .replaceAll('{{shipping_address.full_name}}', orderData.shipping_address.full_name)
                    .replaceAll('{{shipping_address.postcode}}', orderData.shipping_address.postcode)
                    .replaceAll('{{shipping_address.telephone}}', orderData.shipping_address.telephone)
                    .replaceAll('{{shipping_address.country}}', orderData.shipping_address.country)
                    .replaceAll('{{shipping_address.province}}', orderData.shipping_address.province)
                    .replaceAll('{{shipping_address.city}}', orderData.shipping_address.city)
                    .replaceAll('{{shipping_address.address_1}}', orderData.shipping_address.address_1)
                    .replaceAll('{{shipping_address.address_2}}', orderData.shipping_address.address_2)
                    .replaceAll('{{shipping_address.country_name}}', orderData.shipping_address.country_name)
                    .replaceAll('{{shipping_address.province_name}}', orderData.shipping_address.province_name)

                    .replaceAll('{{billing_address.order_address_id}}', orderData.shipping_address.order_address_id)
                    .replaceAll('{{billing_address.uuid}}', orderData.shipping_address.uuid)
                    .replaceAll('{{billing_address.full_name}}', orderData.shipping_address.full_name)
                    .replaceAll('{{billing_address.postcode}}', orderData.shipping_address.postcode)
                    .replaceAll('{{billing_address.telephone}}', orderData.shipping_address.telephone)
                    .replaceAll('{{billing_address.country}}', orderData.shipping_address.country)
                    .replaceAll('{{billing_address.province}}', orderData.shipping_address.province)
                    .replaceAll('{{billing_address.city}}', orderData.shipping_address.city)
                    .replaceAll('{{billing_address.address_1}}', orderData.shipping_address.address_1)
                    .replaceAll('{{billing_address.address_2}}', orderData.shipping_address.address_2)
                    .replaceAll('{{billing_address.country_name}}', orderData.shipping_address.country_name)
                    .replaceAll('{{billing_address.province_name}}', orderData.shipping_address.province_name)
                ,
                to,
            }

            await new SevenClient().sms(params)
        } catch (e) {
            error(e)
        }
    }
}
