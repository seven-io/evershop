import {setDelegate} from "@evershop/evershop/lib/middleware/delegate";
import {INTERNAL_SERVER_ERROR, OK} from "@evershop/evershop/lib/util/httpStatus";
import {buildUrl} from "@evershop/evershop/lib/router";
import {error} from "@evershop/evershop/lib/log";

export default async (request, response, next) => {
    const routeId = request.currentRoute.id
    try {
        const {from, text, to} = request.body
        const payload = {from, text, to}

        setDelegate('seven', payload, request);
        response.status(OK);
        response.$body = {
            data: {
                ...payload,
                links: [
 /*                   {
                        rel: 'customerGrid',
                        href: buildUrl('customerGrid'),
                        action: 'GET',
                        types: ['text/xml']
                    },
                    {
                        rel: 'edit',
                        href: buildUrl('customerEdit', { id: customer.uuid }),
                        action: 'GET',
                        types: ['text/xml']
                    }*/
                ]
            }
        };
        next();
    } catch (e) {
        error(e);
        response.status(INTERNAL_SERVER_ERROR);
        response.json({
            error: {
                status: INTERNAL_SERVER_ERROR,
                message: e.message
            }
        });
    }
};
