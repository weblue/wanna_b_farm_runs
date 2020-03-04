//TODO add farming lvl based items
/*TODO allow controls for user to scroll through tele array
 *To do this, return teleport array and have the selecting logic show the items
 *associated to that teleport
 */
//TODO add pictures for inventory display
//TODO create UI
//TODO make logic accept dynamic input
//TODO profile save/loading logic

const fs = require("fs")

let contentData = fs.readFileSync("farm_db.json")
let content = JSON.parse(contentData)
let profileData = fs.readFileSync("test_schema.json")
let profile = JSON.parse(profileData)

let runs = ["tree", "fruit_tree"]

//Inventory should be all items to carry
let inventory = []
//Patches should include patch list + teleport + location
let patches = []

let keyArr = Object.keys(content.locs)
keyArr.forEach((locKey) => {
    content.locs[locKey]["tele"].forEach((teleport) => {
        if (!content.teleports[teleport]) {
            console.error("***Error --------> " + teleport + " not found")
        }
    })
})

runs.forEach((run) => {
    content.types[run].loc.forEach((location) => {
        let locData = content.locs[location]
        let reqs = locData.req

        if (!reqs || 
            (reqs.length == 1 && profile[reqs[0]]) || 
            (reqs.length == 2 && profile[reqs[0]] && profile.farming_lvl >= reqs[1])) {
                let index = 0
                let complete = false
                while (!complete) {
                    reqs = content.teleports[locData.tele[index]].reqs || ''
                    if (content.teleports[locData.tele[index]] &&
                        (!reqs || 
                        (reqs.length == 1 && profile[reqs[0]]) || 
                        (reqs.length == 2 && profile[reqs[0]] && profile.farming_lvl >= reqs[1]))) {
                        let found = false;
                        patches.forEach(obj => {
                            if (obj.location == locData.name) {
                                obj.patch.push(run)
                                found = true;
                            }
                        })
                        if (!found) {
                            patches.push({
                                "location": locData.name,
                                "teleport": locData.tele[index],
                                "patch": [run]
                            })
                        }
                        if (content.teleports[locData.tele[index]].items) {
                            content.teleports[locData.tele[index]].items.forEach((item) => {
                                if (!inventory.includes(content.items[item].name)) {
                                    inventory.push(content.items[item].name)
                                }
                            })
                            
                        } else {
                            if (!inventory.includes(content.teleports[locData.tele[index]].name)) {
                                inventory.push(content.teleports[locData.tele[index]].name)
                            }
                        }
                        complete = true;
                    } else {
                        index++
                    }
                }
        } else
            console.log("reqs not met for " + location)
    })
})


console.log("Inventory: ")
console.log(inventory)
console.log("Patches: ")
console.log(patches)