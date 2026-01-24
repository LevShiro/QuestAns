const root_elem_id = 'root';
const api_to_send_card = '';
const class_name_for_field = 'field';
const nomer_attribute_name = 'nom';
const name_input_id = 'create_group__input-title';
const delete_button_class = 'create_card__delete_button';

var root;

function add_del_event(b, e) {
    b.addEventListener('click', function () {
        if (root.childElementCount <= 1) {
            //reaction for remove last card
            return;
        }
        delete_card(e);
    });

}



function add_card() {

    let el = root.lastElementChild;
    root.appendChild(el.cloneNode(true));
    el = root.lastChild;
    let elems_to_reset = el.getElementsByClassName(class_name_for_field);
    for (i of elems_to_reset) {
        if (i.getAttribute(nomer_attribute_name) != null) {
            n = i.getAttribute(nomer_attribute_name);
            n = Number.parseInt(n);
            if (isNaN(n)) {
                n = String(root.childElementCount);
            } else {
                n = String(n + 1);
            }
            i.setAttribute(nomer_attribute_name, n);
            i.innerText = n;
        } else {
            i.value = '';
        }
    }
    let b = el.getElementsByClassName(delete_button_class);
    if (b[0] != null) {
        add_del_event(b[0], el);
    }

}

function send_cards() {

    let group_name = '';
    el = document.getElementById(name_input_id);

    if (el != null) group_name = el.value;
    else {
        console.error('element eith id', name_input_id, 'not found');
        group_name = '';
    }
    for (card of root.children) {
        data = new FormData();
        data.append('group_name', group_name);
        elems = card.getElementsByClassName(class_name_for_field);
        for (i of elems) {
            if (i.hasAttribute(nomer_attribute_name)) continue;

            if (i.getAttribute('type') != null && i.getAttribute('type') == 'file') {
                for (f of i.files) {
                    data.append(i.getAttribute('name'), f);
                }
                continue;
            }

            data.append(i.getAttribute('name'), i.value);
        }
        fetch(api_to_send_card, { redirect: "follow", method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken') }, body: data })
        .then(function (resp) {
            if (!resp.ok) console.error('server error code ' + resp.status);
            if (resp.redirected) window.location.href = resp.url;
        })
        .catch(console.error);
    }

}

function delete_card(e) {
    let elem = e.nextElementSibling;
    while (elem != null) {
        for (i of elem.getElementsByClassName(class_name_for_field)) {
            if (i.hasAttribute(nomer_attribute_name)) {
                let n = i.getAttribute(nomer_attribute_name);
                n = Number.parseInt(n);
                if (isNaN(n)) {
                    break;
                } else {
                    n = String(n - 1);
                }
                i.setAttribute(nomer_attribute_name, n);
                i.innerText = n;
                break;
            }

        }

        elem = elem.nextElementSibling;
    }
    e.remove();
}

function init() {
    root = document.getElementById(root_elem_id);
    if (root == null) {
        setTimeout(init, 1000);
        console.log('wait for init');
        return;
    }
    let el = root.lastElementChild;
    let b = el.getElementsByClassName(delete_button_class);
    if (b[0] != null) {
        add_del_event(b[0], el);
    }
    console.log(b);
}


init();