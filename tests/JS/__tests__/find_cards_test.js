 /**
 * @jest-environment jsdom
 */

describe('test for init', () => {

    document.body.innerHTML = '<input type = "text" id = "find_group">'
        + ' <ul id="groups-list"> <div>this text will disapear </div> </ul>'
        + ' <select id="sort_find_input"> < option value = "6" > по популярности</option > <option value="3">по рейтингу</option> </select >'

    log = console.log
    global.console.error = jest.fn(() => { })
    global.console.log = jest.fn(() => { })
    const { reset_elems, make_request, reolve_data } = require('../../../cards/static/cards/scripts/find_cards')
    //reset_elems();
    expect(global.console.log.mock.calls).not.toContain("waiting load")
    expect(document.getElementById('groups-list').childElementCount).toBe(0);
    
})

var cards_api_url = '/cards/api/find_cards/';




const { reset_elems, make_request, reolve_data } = require('../../../cards/static/cards/scripts/find_cards')

describe('test for defined', () => {
    test('test for defined reolve_data', function() {
        expect(reolve_data).toBeDefined()
    });
    test('test for defined make_request', function () {
        expect(make_request).toBeDefined();
    });
    test('test for defined reset_elems', function () {
    expect(reset_elems).toBeDefined();
    });
})

describe('make_request', () => {
    test('invalid status', async () => {
        document.body.innerHTML = '<input type = "text" id = "find_group">'
            + ' <ul id="groups-list"> <div>this text will disapear </div> </ul>'
            + ' <select id="sort_find_input"> < option value = "6" > по популярности</option > <option value="3">по рейтингу</option> </select >'
        
        let test_data = 'test data';

        global.fetch = jest.fn(async function () { return { ok: false, status: 500 } });
        global.alert = jest.fn(() => { });

        let d = document.getElementById('find_group');
        d.value = test_data;


        await make_request(0, 3)
        //await d.dispatchEvent(new Event('input', { bubbles: true }));
        expect(global.alert.mock.calls[0][0]).toContain("500")
        expect(global.fetch.mock.calls[0][0]).toContain(cards_api_url);
        expect(global.fetch.mock.calls[0][1]).toEqual({headers: { "group-name": '', "start": 0, "end": 3, "sort": "3" } })
    });
    test('test for defined make_request', function () {
        expect(make_request).toBeDefined();
    });
    test('test for defined reset_elems', function () {
        expect(reset_elems).toBeDefined();
    });
})


