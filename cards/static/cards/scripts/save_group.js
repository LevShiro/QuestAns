api_url_for_save_group = 'cards/api/save_group'


function save_group(group_id) {
    fetch(api_url_for_save_group, { method: "POST", headers: { 'X-CSRFToken': Cookies.get('csrftoken'), 'group-id': group_id }})
        .then(function (resp) {
            if (!resp.ok) { alert('server error code ' + resp.status); return; }
        })
        .catch(function (e) { alert('error while making request: ' + e) });
}