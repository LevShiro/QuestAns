const api_to_get_group = '';
const api_to_send_ansver = '';
const buttons_id_name = 'buttons';
const ansver_id_name = 'ansver';
const root_id_name = 'root'

var root;
var cur_card;
var fetch_card;
var fetching = false;

function update() {
    if (cur_card != fetch_card && !fetching) {
        send_ansver();
        reset_element();
        make_request();
    }

}

function send_ansver() {
    el = document.getElementById(ansver_id_name);
    if (el == null) {
        console.error('no anser element found with id', ansver_id_name)
        return;
    }
    ansver = el.value;

    fetch(api_to_send_ansver, { method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken'), 'card_id': cur_card}, body: ansver })
        .then(function (resp) {
            if (!resp.ok) alert('server error code ' + resp.status);
        })
        .catch(function (e) { alert('error while sending ansver: ' + e) });

}

function make_request() {
    fetching = true;
    fetch_card = cur_card;
    try {
        fetch(cards_api_url, { headers: { 'card_id': fetch_card} })
            .then(function (v) {
                if (!v.ok) {
                    //reaction to incorrect status code
                    alert('response error ' + v.status);
                    return '';
                } else {
                    return v.text();
                })
            .then(reolve_data)
            .catch(function (e) {
                console.error(e);
                fetching = false;
            });
    } catch (e) {
        console.error(e);
    }
   
}

function resolve_data(data) {

    root.insertAdjacentHTML('beforeend', data);
    fetching = false;
    update();
}

function reset_element() {

    while (root.children[0] != null) {

        try {
            root.removeChild(root.children[0]);
        }
        catch (er) {
            console.log("removing element error while update table: ", er);
        }
    }
    
}

function on_chose_another_card(id) {
    cur_card = id;
    update();
}

function add_listeners() {
    r = document.getElementById(buttons_id_name);
    if (r == null) {
        console.log('no tests');
        return;
    }
    for (i of r.children) {
        function (el) {
            i.add_listeners('click', function () { on_chose_another_card(el.innerText)})
        }(i)
    }

}

add_listeners();
root = document.getElementById(root_id_name);
