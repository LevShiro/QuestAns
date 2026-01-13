const root_elem_id = 'root';
const api_to_send_card = ''
const class_name_for_field = 'field'
const nomer_attribute_name = 'nom'


function add_card() {

    let root = document.getElementById(root_elem_id);
    let el = root.lastElementChild;
    root.appendChild(el.cloneNode(true));
    el = root.lastChild;
    let elems_to_reset = el.getElementsByClassName(class_name_for_field)
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
    

}


function send_cards() {
    let root = document.getElementById(root_elem_id);
    for (i of root.children) {
        data = {}


    }
}


