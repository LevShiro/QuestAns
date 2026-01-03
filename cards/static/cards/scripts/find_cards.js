

chk_interval = setTimeout(configure_listeners, 10000);

var input;
var root;
configure_listeners();

function configure_listeners(){

    a = document.getElementById("find_button");
    input = document.getElementById("find_group");
    root = document.getElementById("groups-list");

    if (a == null || input == null || root == null){
        chk_interval = setTimeout(configure_listeners, 1000);
        console.log("waiting load")
        return;
    }

    clearInterval(chk_interval);
    chk_interval = null;
    input.addEventListener('input', on_text_field_update);
//input.addEventListener('change', on_text_field_update);
    console.log("loaded")

}


cards_api_url = '/cards/api/find_cards/'

step = 10
last_id = null;
elems = []

fetching = false

fetch_text = ''
cur_text = ''

console.log("scrpt init")

function reset_elems() {
    
    for (i in elems){
        try{
            root.removeChild(i);
        }
        catch(er){
            console.log("removing element error while update table: ", er)
        }
    }
    elems = []
    
}


function reolve_data(data){
    id = 0;
    
    
    console.log(data); 
    
    
    if (data == 'stop'){
        if (last_id == null) last_id = id;
        else if(last_id > id ) last_id = id;
        
        console.log("current stop ", last_id)
    }
    
    root.insertAdjacentHTML('beforeend', data);

    let pre_end = elems.length - 1;
    let tec = root.lastChild()

    while (tec != null && tec !== elems[pre_end]) {
        elems[elems.length] = tec;
        tec = tec.previousSibling();
    }

    fetching = false;
    update();
}

function update() {
    if (cur_text != fetch_text && !fetching) {
        reset_elems();
        make_request(0, 10);
    }
}

function on_text_field_update() {
    a = input.value;
    a = a.toLowerCase();
    a = a.trim();
    cur_text = a;
    update();

}

function make_request(start, end) {
    fetching = true;
    try {
        fetch(cards_api_url, { headers: { "group-name": cur_text, "start": start, "end": end } })
            .then(function (v) { return v.text(); })
            .then(reolve_data)
            .catch(function (e) {consoe.error(e) });
    } catch (e) {
        console.error(e)
    }
   
}


