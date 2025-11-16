a = document.getElementById("find_button")
input = document.getElementById("find_group")
console.log("scrpt init")

function test(url) {
    console.log("making request")
    fetch(url, {headers:{"group-name":input.value}}).then(value => value.json()).then(function(v){console.log("get", v)})
    console.log("exit function")
}