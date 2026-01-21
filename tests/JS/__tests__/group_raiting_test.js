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
        global.fetch = jest.fn(async function () { return { ok: false, status: 500 } })
        global.console.error = jest.fn(() => { })

        await update_element();

        expect(global.fetch.mock.calls[0][0]).toContain(global.document.URL);
        expect(global.console.error.mock.calls[0][0]).toContain("500")
        
    })
    test('normal response', () => {
        let test_text = `<div id="${update_element_id}">this is a test text<\div>`
        
        global.fetch = jest.fn(async function () { return { ok: true, status: 200, text: async () => {return test_text}} })
        global.console.error = jest.fn(() => { })
        let replace_text_function = jest.fn(function () { })
        global.document.getElementById = jest.fn(() => { return { replaceWith: replace_text_function} })
        
        
        expect(replace_text_function.mock.calls[0][0]).toContain(test_text);

    })


})

