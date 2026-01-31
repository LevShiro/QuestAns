const api_to_get_group = '/cards/api/get_quest';
const api_to_send_ansver = '/cards/api/send_quest/';
const ansver_id_name = 'ansver';
const root_id_name = 'question-block';
const attrib_name_with_group_id = 'zachet'
const ignore_click_object = 'ignore'
const submit_class_name = 'class_hidden'

var seed = Math.ceil(Math.random() * 1000);
var bounding;
var root;
var is_hidden = true;
var cur_card = '1';
var fetch_card; 
var fetching = false;
var group_id = '';
var ansvers = {};

function get_root() {
    if (root != null) return root;
    root = document.getElementById(root_id_name);
    if (root != null) return root;
    throw "element with id " + root_id_name + " not found";
}

function get_ignored_bounding() {
    if (bounding != null) return bounding;
    let elem = document.getElementById(ignore_click_object);
    if (elem == null) throw "element with id " + ignore_click_object + " not found";
    bounding = elem.getBoundingClientRect();
    return bounding;
}

function update() {
    if (cur_card != fetch_card && !fetching) {
        save_ansver();
        reset_element();
        make_request();
    }
    canncel_send_data();
}

function save_ansver(grp_id) {
    if (grp_id != null) group_id = grp_id;
    el = document.getElementById(ansver_id_name);
    if (el == null) {
        console.error('no ansver element found with id', ansver_id_name)
        return;
    }
    ansver = el.value;
    ansvers[fetch_card] = ansver;
}

function make_request() {
    fetching = true;
    fetch_card = cur_card;
    try {
        fetch(api_to_get_group, { headers: { 'card-id': fetch_card, 'group-id': group_id, "seed": seed} })
            .then(function (v) {
                if (!v.ok) {
                    if (v.status == 416) {
                        cur_card = '1';
                        fetching = false;
                        update();
                        throw "card id out of range";
                    }
                    //reaction to incorrect status code
                    alert('response error ' + v.status);
                    return '';
                } else {
                    return v.text();
                }})
            .then(resolve_data)
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
    let el = document.getElementById(ansver_id_name);
    if (el != null && ansvers[fetch_card] != null) {
        el.value = ansvers[fetch_card];
    }
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
    cur_card = nom;
    group_id = grp_id;
    update();
}

function submit_send_answers(grp_id) {
    if (grp_id != null) group_id = grp_id;
    save_ansver();
    fetch(api_to_send_ansver, { method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken'), 'group-id': group_id, "seed": seed }, body: JSON.stringify(ansvers) })
        .then(function (resp) {
            if (!resp.ok) {alert('server error code ' + resp.status); return; }
            return resp.text();
        })
        .then(function (v){document.documentElement.innerHTML  = v})
        .catch(function (e) { alert('error while sending ansver: ' + e) });


}

function canncel_send_data() {
    is_hidden = true;
    for (i of document.getElementsByClassName(submit_class_name)) { i.setAttribute('hidden', ''); };

}

function send_answers(grp_id) {
    if (grp_id != null) group_id = grp_id;
    is_hidden = false;
    for (i of document.getElementsByClassName(submit_class_name)) { i.removeAttribute("hidden"); }

}

function next(grp_id) {
    if (grp_id != null) group_id = grp_id;
    let a = Number(cur_card);
    if (isNaN(a)) a = 0;
    cur_card = String(a + 1)
    update();
}

function on_document_click(e) {
    if (is_hidden) return;
    let bnd = get_ignored_bounding();
    if (!(e.pageX > bnd.left && e.pageX < bnd.right && e.pageY > bnd.top && e.pageY < bnd.bottom)) canncel_send_data();

}


document.addEventListener('mousedown', on_document_click);

root = document.getElementById(root_id_name);
let el = root.getAttribute(attrib_name_with_group_id)
if (el != null) {
    group_id = el;
    make_request(), attrib_name_with_group_id
} else {
    console.log('attribute', attrib_name_with_group_id, 'not found')

}

