//TODO add farming lvl based items
//TODO adjust all POH teles to be house tab plus scroll

const fs = require("fs")

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
                //TODO Associate teleports with patches/patch types
                // console.log(locData.tele[0])
                // console.log(content.teleports[locData.tele[0]])
                let index = 0
                let complete = false
                while (!complete) {
                    console.log(locData.tele[index])
                    reqs = content.teleports[locData.tele[index]].reqs || ''
                    if (content.teleports[locData.tele[index]] &&
                        (!reqs || 
                        (reqs.length == 1 && profile[reqs[0]]) || 
                        (reqs.length == 2 && profile[reqs[0]] && profile.farming_lvl >= reqs[1]))) {
                        //TODO eventually merge locations + multiple run types as one object
                        patches.push({
                            "patch": run,
                            "location": locData.name
                        })
                        if (content.teleports[locData.tele[index]].items) {
                            content.teleports[locData.tele[index]].items.forEach((item) => {
                                if (!inventory.includes(content.items[item].name)) {
                                    inventory.push(content.items[item].name)
                                }
                            })
                            complete = true;
                            //TODO for each item add to inventory
                        } else {
                            if (!inventory.includes(content.teleports[locData.tele[0]].name)) {
                                inventory.push(content.teleports[locData.tele[0]].name)
                            }
                            complete = true;
                        }
                    } else {
                        index++
                    }
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