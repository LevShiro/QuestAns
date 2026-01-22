
api_url_for_save_group = '/cards/api/save_group'



function save_group(group_id) {
    fetch(api_url_for_save_group, { method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken'), 'group-id': group_id, "save": true } })
        .then(function (resp) {
            if (!resp.ok) { alert('server error code ' + resp.status); return; }
        })
        .catch(function (e) { alert('error while making request: ' + e) })
        .finally(update_element);
}

function discard_save(group_id) {
    fetch(api_url_for_save_group, { method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken'), 'group-id': group_id, "save": false } })
        .then(function (resp) {
            if (!resp.ok) { alert('server error code ' + resp.status); return; }
        })
        
        .catch(function (e) { alert('error while making request: ' + e) })
        .finally(update_element);
}

//ôóíêöèÿ äëÿ îáíîâëåíèÿ ýëåìåíòà áåç ïåðåçàãðóçêè ñòðàíèöû
async function update_element() {
    let resp = await fetch(document.URL);

    if (!resp.ok) {
        console.error('get status code ' + resp.status)
        return;
    }
    try {
        let resptext = await resp.text();
        let df = new DocumentFragment();
        df.appendChild(document.createElement('n')).insertAdjacentHTML('afterbegin', resptext)
        let el = df.getElementById(element_for_update);
        if (el == null) {
            console.error('element on getted page not exist');
            return;
        }
        let tel = document.getElementById(element_for_update)
        if (tel == null) {
            console.error('element on page not exist');
            return;
        }
        tel.replaceWith(el);
    } catch (e) {
        console.error(e);

    }

}