console.log(document.cookie)

document.cookie = "name=dishant1122334400"
document.cookie = "name2=dishant1122334402"
document.cookie = "name=abhi"

let key = prompt("enter your key")
let value = prompt("enter your value")

document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`

console.log(document.cookie)
