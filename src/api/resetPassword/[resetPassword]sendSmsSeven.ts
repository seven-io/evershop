import { EvershopRequest, EvershopResponse } from '@evershop/evershop'
import {getConfig} from '@evershop/evershop/lib/util/getConfig'
import {buildUrl} from '@evershop/evershop/lib/router'
import {getContextValue} from '@evershop/evershop/graphql/services'
import {INTERNAL_SERVER_ERROR} from '@evershop/evershop/lib/util/httpStatus'
import {debug} from '@evershop/evershop/lib/log'
import {SevenConfiguration} from '../../bootstrap.js'
import SevenClient from '../../SevenClient.js'

export default async (request: EvershopRequest, response: EvershopResponse, next) => {
  try {
    const {
      $body: { email, token }
    } = response


    const {enabled, text} = getConfig<SevenConfiguration['events']['reset_password']>('seven.events.reset_password')

      if (!enabled) {
          debug('resetPassword stops as the event is not enabled')
          return // Check if we need to send the email on order placed event
      }
      if (!text) {
          debug('resetPassword stops as the text is not set')
          return // Check if the text is set
      }


    const url = buildUrl('updatePasswordPage') // Generate the url to reset password page
    const resetPasswordUrl = `${getContextValue( // Add the token to the url
      request,
      'homeUrl', ''
    )}${url}?token=${token}`

    const params = {
      text: text.replaceAll('{{reset_password_url}}', resetPasswordUrl),
      to: email,
    }
      await new SevenClient().sms(params)
    next()
  } catch (e) {
    debug(e)

    response.status(INTERNAL_SERVER_ERROR)
    response.json({
      error: {
        message: e.message,
        status: INTERNAL_SERVER_ERROR,
      }
    })
  }
}
