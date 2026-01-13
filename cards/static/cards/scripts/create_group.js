const root_elem_id = 'root';



function add_card() {

    let root = document.getElementById(root_elem_id);
    let el = root.lastElementChild;
    root.appendChild(el.cloneNode(true));
    el = root.lastChild;
    let elems_to_reset = el.getElementsByClassName('field')
    for (i of elems_to_reset) {
        if (i.getAttribute('nom') != null) {
            n = i.getAttribute('nom');
            n = Number.parseInt(n);
            if (isNaN(n)) {
                n = String(root.childElementCount);
            } else {
                n = String(n + 1);
            }
            i.setAttribute('nom', n);
            i.value = n;
        } else {
            i.value = '';
        }
    }
    

}



