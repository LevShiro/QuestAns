

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
input.addEventListener('change',test);
console.log("loaded")

}


cards_api_url = '/cards/api/find_cards/'

step = 10
last_id = null;
elems = []

console.log("scrpt init")

function reolve_data(data){
    id = 0;


    console.log(data); 
    for (i in elems){
        try{
            root.removeChild(i);
        }
        catch(er){
            console.log("removing element error while update table: ", er)
        }
    }

    if (data == 'stop'){
        if (last_id == null) last_id = id;
        else if(last_id > id ) last_id = id;

        console.log("current stop ", last_id)
    }
    let pre_end = elems.length - 1;
    root.insertAdjacentHTML('beforeend', data);
    


}

function on_text_field_update(){




}


function test() {    
    



    fetch(cards_api_url, { headers: { "group-name": input.value, "start": 0, "end": 3 } })
    .then(function (v) { return v.text();})
    .then(reolve_data)

    
}