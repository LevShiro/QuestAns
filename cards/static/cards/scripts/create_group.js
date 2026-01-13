const root_elem_id = '';



function add_card() {

    let root = document.getElementById(root_elem_id);
    el = root.lastElementChild;
    root.appendChild(el.cloneNode(true));
    el = root.lastChild;
    let elems_to_reset = el.getElementsByClassName('field')
    for (i of elems_to_reset) {
        i.value = '';
    }
}



