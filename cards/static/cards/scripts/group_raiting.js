
rating_api_url = 'api/raiting_group/'
selector_id = "raiting__input"
update_element_id = ''


function update_element() {
    try {
        resp = await fetch(document.URL);
    } catch (e) {
        console.error(e);
        return;
    }
    
    if (!resp.ok) {
        console.error('get status code ' + resp.status)
        return;
    }
    try {
        resptext = await resp.text(); // need for check
        df = new DocumentFragment();
        df.appendChild(document.createElement('html')).insertAdjacentHTML('afterbegin', resptext)
        el = df.getElementById(update_element_id);
        if (el == null) {
            console.error('element on getted not exist');
            return;
        }
        tel = document.getElementById(update_element_id)
        if (tel == null) {
            console.error('element on page not exist');
            return;
        }
        tel.replaceWith(el);

    } catch (e) {

    }



}


function send_data(dat) {
    try {
        fetch(rating_api_url, { method: "POST", headers: dat })
            .then(function (v) {
                if (!v.ok) {
                    console.error('response error ' + v.status);
                    return;
                }
            })
            .catch(function (e) {
                console.error(e);
            });
    } catch (e) {
        console.error(e);
    }
}

function set_mark(group_id) {
    let a = document.getElementById(selector_id);
    let v = Number.parseInt(a.value);

    if (isNaN(v) || v > 5 || v < 1) {
        console.error('invalid raiting', a.value)
        return;
    }

    send_data({ "group-id": group_id, "mark": v });


}


function delete_mark(group_id) {
    send_data({ "group-id": group_id, "mark": 0 })
}