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

describe('update data', () => {
    test('error response', async () => {
        let url = 'test url'
        global.fetch = jest.fn(async function () { return { ok: false, status: 500 } })
        global.console.error = jest.fn(() => { })

        await update_element();

        expect(global.fetch.mock.calls[0][0]).toContain(global.document.URL);
        expect(global.console.error.mock.calls[0][0]).toContain("500")
        
    })
})

