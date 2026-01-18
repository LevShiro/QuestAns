 /**
 * @jest-environment jsdom
 */
const { rating_api_url, update_element, send_data } = require('../../../cards/static/cards/scripts/group_raiting')
describe('test for defined', () => {
    test('test for update_element', ()=> {
        expect(update_element).toBeDefined()
    })
    test('test for send_data', () => {
        expect(send_data ).toBeDefined()
    })
})


