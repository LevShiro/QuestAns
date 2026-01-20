export const rating_api_url = 'api/raiting_group/'
const selector_id = "raiting__input"
//элемент который надо обновлять
const update_element_id = 'group__raiting'
var timer_id;

//функция для обновления элемента без перезагрузки страницы
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
        let el = df.getElementById(update_element_id);
        if (el == null) {
            console.error('element on getted page not exist');
            return;
        }
        let tel = document.getElementById(update_element_id)
        if (tel == null) {
            console.error('element on page not exist');
            return;
        }
        tel.replaceWith(el);
    } catch (e) {
        console.error(e);

    }
    
}

function send_data(dat) {
    try {
        fetch(rating_api_url, { method: "POST", headers: { ...dat, 'X-CSRFToken': Cookies.get('csrftoken') } })
            .then(function (v) {
                if (!v.ok) {
                    console.error('response error ' + v.status);
                    return;
                }
            })
            .catch(function (e) {
                console.error(e);
            })
            .finally(update_element);
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

if (typeof module != "undefined") {
    module.exports.update_element = update_element;
    module.exports.send_data = send_data;
}