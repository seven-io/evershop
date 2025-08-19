import config from "config";

export type SevenConfiguration = {
    apiKey: string
    events: {
        order_created: {
            enabled: boolean
            text: string
        }
        order_placed: {
            enabled: boolean
            text: string
        }
        reset_password: {
            enabled: boolean
            text: string
        }
    }
    from: string
}

const sevenConfig: SevenConfiguration = {
    apiKey: process.env.SEVEN_API_KEY || '',
    events: {
        order_created: {
            enabled: false,
            text: 'An order with ID {{order_id}} has been created for customer with email {{customer_email}}.',
        },
        order_placed: {
            enabled: false,
            text: 'An order with ID {{order_id}} has been placed for customer with email {{customer_email}}.',
        },
        reset_password: {
            enabled: false,
            text: 'You have requested to reset your password. Please click on the link below to reset your password.\n{{reset_password_url}}',
        },
    },
    from: 'EverShop',
}

export default () => {
    config.util.setModuleDefaults('seven', sevenConfig)
    // Getting config value like this: config.get('seven.apiKey');
}
