
rating_api_url = 'api/raiting_group/'
selector_id = "raiting__input"

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

