 /**
 * @jest-environment jsdom
 */
const { reset_elems, make_request, reolve_data } = require('../../../cards/static/cards/scripts/find_cards')
test('test for defined', function () {
    expect(reolve_data).toBeDefined()
    expect(make_request).toBeDefined();
    expect(reset_elems).toBeDefined();
})