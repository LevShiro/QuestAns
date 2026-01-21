 /**
 * @jest-environment jsdom
 */
const { rating_api_url, update_element, send_data, update_element_id } = require('../../../cards/static/cards/scripts/group_raiting')

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
    test('normal response', async () => {

        let test_text = `<div id="${update_element_id}"> this is a test text  <\div>`

        let df = new DocumentFragment();
        df.appendChild(document.createElement('n')).insertAdjacentHTML('afterbegin', test_text)

        global.fetch = jest.fn(async function () { return { ok: true, status: 200, text: async () => {return test_text}} })
        global.console.error = jest.fn(() => { })
        var replace_text_function = { replaceWith: jest.fn(function () { }) }
        global.document.getElementById = jest.fn(() => { return replace_text_function })

        await update_element();

        expect(global.console.error.mock.calls).toHaveLength(0);
        expect(replace_text_function.replaceWith.mock.calls[0][0].innerHTML).toBe(df.getElementById(update_element_id).innerHTML);

    })
})

describe('send_data', () => {
    test('error fetch', async () => {
        global.fetch = jest.fn(async function () { return { ok: false, status: 500 } })
        global.console.error = jest.fn(() => { })
        global.Cookies = { get: jest.fn(() => "token") }

        await send_data({ a:"dataa", b:"second data"});

        expect(global.console.error.mock.calls[0][0]).toContain("500")
        expect(global.fetch.mock.calls[0][0]).toContain(rating_api_url);
        expect(global.fetch.mock.calls[0][1]).toEqual({ method: "POST", headers: { a: "dataa", b: "second data", 'X-CSRFToken':'token'}})
        
    })
    test('normal fetch', async () => {
        global.fetch = jest.fn(async function () { return { ok: true, status: 200 } })
        global.console.error = jest.fn(() => { })
        global.Cookies = { get: jest.fn(() => "token") }

        await send_data({ a: "dataa", b: "second data" });

        expect(global.console.error.mock.calls).toHaveLength(0);
        expect(global.fetch.mock.calls[0][0]).toContain(rating_api_url);
        expect(global.fetch.mock.calls[0][1]).toEqual({ method: "POST", headers: { a: "dataa", b: "second data", 'X-CSRFToken': 'token' } })

    })

})

