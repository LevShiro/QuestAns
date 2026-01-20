var cards_api_url = '/cards/api/find_cards/';

//amount of elements that fethced at once to API
var step = 3;
//shift bottom page edge
var page_bottom_offset = 200;

var chk_interval;
var elems = [];
var fetching = false;
var fetch_text = 'this text for starting empty response to fill page';
var cur_text = '';
var end_of_data = false;
var selected_fetch = '';
var cur_selected = '';

var input;
var root;
var selector;

configure_listeners();

function configure_listeners(){
    input = document.getElementById("find_group");
    root = document.getElementById("groups-list");
    selector = document.getElementById("sort_find_input");
    
    if (input == null || root == null || selector == null){
        chk_interval = setTimeout(configure_listeners, 1000);
        console.log("waiting load");
        return;
    }
    
    clearInterval(chk_interval);
    chk_interval = null;
    cur_selected = selector.value;
    input.addEventListener('input', on_text_field_update);
    selector.addEventListener('change', on_selector_change);
    window.addEventListener('scroll', on_scroll);
    
    //console.log("loaded");
    update();
}

function update() {
    if ((cur_text != fetch_text || cur_selected != selected_fetch) && !fetching) {
        reset_elems();
        make_request(0, step);
        return;
    }
    if (document.body.scrollHeight <= window.innerHeight + window.pageYOffset + page_bottom_offset && !fetching && !end_of_data) {
        
        make_request(elems.length, elems.length + step);
        return;
    }
}

function reset_elems() {
    
    while (root.children[0] != null) {
        
        try{
            root.removeChild(root.children[0]);
        }
        catch(er){
            console.log("removing element error while update table: ", er);
        }
    }
    elems = [];
    end_of_data = false;
    
}

function make_request(start, end) {
    fetching = true;
    fetch_text = cur_text;
    selected_fetch = cur_selected;
    try {
        fetch(cards_api_url, { headers: { "group-name": encodeURIComponent(fetch_text), "start": start, "end": end, "sort": selected_fetch } })
            .then(function (v) {
                if (!v.ok) {
                    //reaction to incorrect status code
                    alert('response error ' + v.status);
                    return '';
                } else { 
                return v.text();
            }
            })
            .then(reolve_data)
            .catch(function (e) {
                console.error(e);
                end_of_data = true;
                fetching = false;
            });
    } catch (e) {
        end_of_data = true;
        fetching = false;
        console.error(e);
    }
}

function reolve_data(data){
    id = 0;
    
    if (data == '') {
        end_of_data = true;
    } else {
        
        root.insertAdjacentHTML('beforeend', data);
        
        let end = elems.length;
        let tec = root.lastElementChild;
        let ok = false;
        
        while (tec != null && tec != elems[end - 1]) {
            elems.splice(end, 0, tec);
            tec = tec.previousElementSibling;
            ok = true;
        }
        if (!ok) {
            end_of_data = true;
        }
    }
    fetching = false;
    update();
}

function on_text_field_update() {
    a = input.value;
    
    a = a.trim();
    cur_text = a;
    update();

}

function on_scroll() {
    
    if (!end_of_data) {
        update();
    }
}

function on_selector_change() {
    cur_selected = selector.value;
    update();
}

if (typeof module != "undefined") {
    module.exports.reset_elems = reset_elems;
    module.exports.make_request = make_request;
    module.exports.reolve_data = reolve_data;
}
