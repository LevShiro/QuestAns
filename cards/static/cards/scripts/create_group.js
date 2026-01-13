const root_elem_id = 'root';
const api_to_send_card = '';
const class_name_for_field = 'field';
const nomer_attribute_name = 'nom';
const name_input_id = 'create_group__input-title';
const delete_button_class = 'create_cart__delete_button';

function add_del_event(e) {
    b.addEventListener('click', function () {
        on_delete_button_pressed(e);
    });

}



function add_card() {

    let root = document.getElementById(root_elem_id);
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
        add_del_event(b);
    }

}

function send_cards() {
    let root = document.getElementById(root_elem_id);
    result_data = [];
    el = document.getElementById(name_input_id);
    if (el != null) result_data.push(el.value);
    else {
        console.error('element eith id', name_input_id, 'not found');
        result_data.push('');
    }
    for (card of root.children) {
        data = new FormData();
        elems = card.getElementsByClassName(class_name_for_field);
        for (i of elems) {
            if (i.hasAttribute(nomer_attribute_name)) continue;

            if (i.getAttribute('type') != null && i.getAttribute('type') == 'file') {
                for (f of i.files) {
                    data.append(i.getAttribute('name'), f);
                }
                continue;
            }

            data.append(i.getAttribute('name'), i.getAttribute('value'));
        }
        result_data.push(data)
    }
    fetch(api_to_send_card, { method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken') }, body: JSON.stringify(result_data) })
        .then(function (resp) {
            if (!resp.ok) console.alert('server error code ' + resp.status);
        })
        .catch(console.alert);
}

function on_delete_button_pressed(e) {
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

}

function init() {
    let root = document.getElementById(root_elem_id);
    let el = root.lastElementChild;
    let b = el.getElementsByClassName(delete_button_class);
    if (b[0] != null) {
        add_del_event(b);
    }

}


init();