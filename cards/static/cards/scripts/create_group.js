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
    result_data = []
    for (card of root.children) {
        data = new FormData();
        elems = card.getElementsByClassName(class_name_for_field)
        for (i of elems) {
            if (i.hasAttribute(nomer_attribute_name)) continue;
            
            if (i.getAttribute('type') != null && i.getAttribute('type') == 'file') {
                for (f of i.files) {
                    data.append(i.getAttribute('name'), f)
                }
                continue;
            }
            
            data.append(i.getAttribute('name'), i.getAttribute('value'))
        }
        result_data.push(data)
    }
    fetch(api_to_send_card, { method: "POST", headers: {'X-CSRFToken': Cookies.get('csrftoken') }, body: JSON.stringify(result_data)})
    .catch(console.error)
}


