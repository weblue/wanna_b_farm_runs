//TODO add farming lvl based items
//TODO get runs from args
//TODO adjust all POH teles to be house tab plus scroll

const fs = require("fs")
const yargs = require("yargs")

let contentData = fs.readFileSync("farm_db.json")
let content = JSON.parse(contentData)
let profileData = fs.readFileSync("test_schema.json")
let profile = JSON.parse(profileData)

let runs = ["tree", "fruit_tree"]

//Inventory should be all items to carry
let inventory = []

//Patches should include patch list + teleport
let patches = []

let keyArr = Object.keys(content.locs)
keyArr.forEach((locKey) => {
    content.locs[locKey]["tele"].forEach((teleport) => {
        if (!content.teleports[teleport]) {
            console.error("***Error --------> " + teleport + " not found")
        }
    })
})

//let runTypes = Object.keys(jsonContent.types)

runs.forEach((run) => {
    content.types[run].loc.forEach((location) => {
        let locData = content.locs[location]
        let reqs = locData.req 

        if (!reqs || 
            (reqs.length == 1 && profile[reqs[0]]) || 
            (reqs.length == 2 && profile[reqs[0]] && profile.farming_lvl >= reqs[1])) {
                patches.push(locData)
                //TODO change this to allow selecting in array
                if (!content.teleports[locData.tele[0]].items){
                    inventory.push(content.teleports[locData.tele[0]])
                } else {
 //TODO for each item add to inventory
                }
        } else
            console.log("reqs not met for " + location)
    })
})

//TODO allow controls for user to scroll through tele array

console.log("Inventory: ")
console.log(inventory)
console.log("Patches: ")
console.log(patches)