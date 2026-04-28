<p align="center">
  <img src="https://www.seven.io/wp-content/uploads/Logo.svg" width="250" alt="seven logo" />
</p>

<h1 align="center">seven SMS for EverShop</h1>

<p align="center">
  Send transactional SMS for order and password-reset events from <a href="https://evershop.io/">EverShop</a> via the seven gateway.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-teal.svg" alt="MIT License" /></a>
  <a href="https://www.npmjs.com/package/@seven.io/evershop"><img src="https://img.shields.io/npm/v/@seven.io/evershop" alt="npm" /></a>
  <img src="https://img.shields.io/badge/EverShop-1.0%2B-blue" alt="EverShop 1.0+" />
  <img src="https://img.shields.io/badge/Node.js-16%2B-brightgreen" alt="Node.js 16+" />
</p>

> Requires EverShop **1.0.0-rc.6 or higher**.

---

## Features

- **`order_created` SMS** - Fire when an order is first created
- **`order_placed` SMS** - Fire when payment confirms the order (e.g. after Stripe / PayPal callback or COD checkout)
- **`reset_password` SMS** - Send the password reset link as SMS
- **Template Placeholders** - Reference any field of the order or reset payload via `{{field}}`

## Prerequisites

- An [EverShop](https://evershop.io/) installation (>= 1.0.0-rc.6)
- A [seven account](https://www.seven.io/) with API key ([How to get your API key](https://help.seven.io/en/developer/where-do-i-find-my-api-key))

## Installation

```bash
npm install @seven.io/evershop
```

Register the extension in `config/default.json`:

```json
{
  "system": {
    "extensions": [
      {
        "enabled":  true,
        "name":     "seven",
        "priority": 10,
        "resolve":  "node_modules/@seven.io/evershop"
      }
    ]
  }
}
```

## Configuration

Add a `seven` block to `config/config.json`:

```json
{
  "seven": {
    "apiKey": "<your-seven-api-key>",
    "from":   "EverShop",
    "events": {
      "order_created": {
        "enabled": true,
        "text":    "Order {{order_id}} has been created for {{customer_email}}."
      },
      "order_placed": {
        "enabled": true,
        "text":    "Order {{order_id}} has been placed for {{customer_email}}."
      },
      "reset_password": {
        "enabled": true,
        "text":    "Reset your password: {{reset_password_url}}"
      }
    }
  }
}
```

## Available Placeholders

### Order events

The full order object is exposed - common fields include:

- `{{order_id}}`, `{{order_number}}`, `{{customer_email}}`, `{{customer_full_name}}`
- `{{currency}}`, `{{grand_total}}`, `{{sub_total}}`, `{{discount_amount}}`
- `{{shipping_method_name}}`, `{{payment_method_name}}`, `{{shipment_status}}`, `{{payment_status}}`
- `{{shipping_address.full_name}}`, `{{shipping_address.telephone}}`, `{{shipping_address.country_name}}`
- `{{items.0.product_name}}`, `{{items.0.qty}}`, `{{items.0.final_price}}`

### Reset password

| Placeholder | Description |
|-------------|-------------|
| `{{reset_password_url}}` | URL the customer clicks to set a new password |

## Support

Need help? Feel free to [contact us](https://www.seven.io/en/company/contact/) or [open an issue](https://github.com/seven-io/evershop/issues).

## License

[MIT](LICENSE)
