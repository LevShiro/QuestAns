const api_to_get_group = '';
const api_to_send_ansver = '';
const ansver_id_name = 'ansver';
const root_id_name = 'root'

var root;
var cur_card = '1';
var fetch_card;
var fetching = false;
var group_id = '';

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

    fetch(api_to_send_ansver, { method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken'), 'card_id': cur_card, 'group_id': group_id}, body: ansver })
        .then(function (resp) {
            if (!resp.ok) alert('server error code ' + resp.status);
        })
        .catch(function (e) { alert('error while sending ansver: ' + e) });

}

function make_request() {
    fetching = true;
    fetch_card = cur_card;
    try {
        fetch(cards_api_url, { headers: { 'card_id': fetch_card, 'group_id': group_id} })
            .then(function (v) {
                if (!v.ok) {
                    //reaction to incorrect status code
                    alert('response error ' + v.status);
                    return '';
                } else {
                    return v.text();
                }})
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

function on_chose_another_card(nom, grp_id) {
    cur_card = id;
    group_id = grp_id;
    update();
}


make_request();
root = document.getElementById(root_id_name);
