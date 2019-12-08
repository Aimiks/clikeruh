
//======= GLOBAL VAR =========

/**
 * @typedef upgradeObject
 * @type {Object}
 * @property {number} id
 * @property {boolean} unlocked
 * @property {boolean} active
 */

/**
 * @typedef upgradeArray
 * @type {Array.<upgradeObject>}
 */

/**
 * @typedef genObject
 * @type {Object}
 * @property {number} genId
 * @property {boolean} frozen
 * @property {upgradeArray} upgrade
 */

/**
 * @typedef genArray
 * @type {Array.<genObject>}
 */

/**
 * @typedef userDataObject
 * @type {Object}
 * @property {number} user_data.satisfaction
 * @property {genArray} user_data.gen
 * */

/**
* @typedef {Object} genAuto
* @property {number} id
* @property {upgradeObject} upgrade
*/

 /**
  * @type {userDataObject}
  */
var user_data = {
    satisfaction : 0,
    gen:[]
};
//======= =========== =========
function getGeneratorsData() {
    return JSON.parse(`
        [
            {
                "id": 1,
                "label": "Se lever à 12h",
                "unlock_pt" : 0,
                "increment":50,
                "award" : 1,
                "upgrade" : [
                    {
                        "id" : 1,
                        "label" : "Auto",
                        "type": "auto",
                        "award" : 1,
                        "increment" : 10,
                        "delay" : 100,
                        "description" : "",
                        "cost": 120
                    }
                ]
            },
            {
                "id": 2,
                "label": "Manger un bol de cereal",
                "unlock_pt" : 360,
                "increment":10,
                "award" : 3,
                "upgrade" : [
                    {
                        "id" : 1,
                        "label" : "Auto",
                        "type": "auto",
                        "award" : 3,
                        "increment" : 5,
                        "delay" : 500,
                        "description" : "",
                        "cost": 660
                    }
                ]
            },
            {
                "id": 3,
                "label": "Regarder One Piece",
                "unlock_pt" : 1000,
                "increment":10,
                "award" : 6
            },
            {
                "id": 4,
                "label": "Jouer à minecraft"
            },
            {
                "id": 5,
                "label": "Manger un botan avec son BFF",
                "alt": {
                    "label" : "Manger un botan en solo"  
                }
            },
            {
                "id": 6,
                "label": "Jouer au café des jeux"
            },
            {
                "id": 7,
                "label": "Jouer à isaac"
            },
            {
                "id": 8,
                "label": "Recevoir une réponse de pôle emploi"
            },
            {
                "id": 9,
                "label": "Jouer à un clicker"
            },
            {
                "id": 10,
                "label": "Jouer aux jeux de sociétés avec son frère"
            },
            {
                "id": 11,
                "label": "Jouer Shaco sur LoL"
            },
            {
                "id": 12,
                "label": "Faire un laser game",
                "requirements" : {
                    "reborn" : true
                }
            },
            {
                "id": 13,
                "label": "Faire une gamejam",
                "requirements" : {
                    "reborn" : true
                }
            },
            {
                "id": 14,
                "label": "Regarder mystère à truc",
                "requirements" : {
                    "reborn" : true
                }
            }
    
        ]`);
}
/**
 * @returns {genAuto}
 */
function getGeneratorWithAuto() {
    return (getGeneratorsData()
    .filter( elem => elem.upgrade && elem.upgrade
        .findIndex(upg => upg.type === 'auto')>=0)
    .map( 
        elem => {
            return {
                genId: elem.id, 
                upgrade: elem.upgrade.filter( upg => upg.type === 'auto')[0]
            }
        }
    ));
}
/**
 * 
 * @param {*} object 
 */
function getTemplate(generatorData) {
    let template = `<div data-id={{id}} class="generator">
                        <div class="ico"></div>
                        <div class="main">
                            <div id="g-{{id}}" class="generatorBarContainer">
                                <div data-prc=0 class="bgBar"></div>
                                <div class="generatorName">
                                    <span>{{label}}</span>
                                </div>
                            </div>
                            <div class="interactifsContainer">
                                <div class="upgrade">
                                    <button data-type="{{upgradeType_0}}" data-id="{{upgradeId_0}}">{{upgradeLabel_0}}</button>
                                    <button data-type="{{upgradeType_1}}" data-id="{{upgradeId_1}}">{{upgradeLabel_1}}</button>
                                    <button data-type="{{upgradeType_2}}" data-id="{{upgradeId_2}}">{{upgradeLabel_2}}</button>
                                    <button data-type="{{upgradeType_3}}" data-id="{{upgradeId_3}}">{{upgradeLabel_3}}</button>
                                </div>
                                <div class="generatorButtonContainer">
                                    <button data-id={{id}} data-award={{award}} data-increment={{increment}} class="generatorButton">Planifier</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
    for(let [key, value] of Object.entries(generatorData)) {
            
        let reg = new RegExp(`{{${key}}}`,'gi');
        template = template.replace(reg,value);
    };
    let value;
    if(generatorData.upgrade) {
        value = generatorData.upgrade;
    }
    for(let i = 0; i<4; ++i) {
        if(value && value[i]) {
            let up = value[i];
            template = template.replace(new RegExp(`{{upgradeType_${i}}}`,'gi'),up.type);
            template = template.replace(new RegExp(`{{upgradeId_${i}}}`,'gi'),up.id);
            template = template.replace(new RegExp(`{{upgradeLabel_${i}}}`,'gi'), up.label);
        } else {
            template = template.replace(new RegExp(`{{upgradeType_${i}}}`,'gi'),-1);
            template = template.replace(new RegExp(`{{upgradeId_${i}}}`,'gi'),-1);
            template = template.replace(new RegExp(`{{upgradeLabel_${i}}}`,'gi'), ' ');
        }
    }
    return template;
}

function getUpgradeDataFromGen(genId,upgId) {
    let gens = getGeneratorsData();
    let ind = gens.findIndex( elem => elem.id === genId);
    if( ind >= 0 && gens[ind].upgrade) {
        let upg = gens[ind].upgrade.find( upg => upg.id === upgId)
        if( upg ) {
            return upg;
        }
    }
    return null;
}


// ================== USER RELATED =====================
function set_user_satisfaction(nb) {
    user_data.satisfaction = nb;
}
function increase_user_satisfaction(amount) {
    set_user_satisfaction(get_user_satisfaction() + amount);
}
function get_user_satisfaction() {
    return user_data.satisfaction;
}
function save_user_data() {
    window.localStorage.setItem("user_data", JSON.stringify(user_data));
}
function load_user_data() {
    if(window.localStorage.getItem('user_data')) {
        user_data = JSON.parse(window.localStorage.getItem('user_data'));
    }
}
function find_upgrade_from_gen(genId,upgId) {
    let ind = user_data.gen.findIndex( elem => elem.genId === genId);
    if( ind >= 0) {
        let upg = user_data.gen[ind].upgrade.find( upg => upg.id === upgId)
        if( upg ) {
            return upg;
        }
    }
    return null;
}
function did_user_unlocked_upgrade(genId,upgId) {
    let upg = find_upgrade_from_gen(genId,upgId)
    if(upg) {
        return upg.unlocked === true;
    }
    return false;
}
function add_user_upgrade(genId,upgId,type) {
    if(type=='auto') {
        let ind = user_data.gen.findIndex( elem => elem.genId === genId);
        if( ind === -1) {
            user_data.gen.push(
                { 
                    'genId' : genId,
                    'frozen': false,
                    'upgrade' : [
                        {
                            'id':upgId,
                            'unlocked':true,
                            'active':true
                        }
                    ]
                }
            );
        } else {
            let upgind = user_data.gen[ind].upgrade.findIndex( upg => upg.id === upgId)
            if( upgind === -1) {
                user_data.gen[ind].upgrade[upgind] = 
                {
                    'id':upgId,
                    'unlocked':true, 
                    'active':true
                };
            } else {
                user_data.gen[ind].upgrade[upgind].unlocked = true;
            }
        }
        
    }
}
function change_auto_gen_of(genId, id) {
    let upg = find_upgrade_from_gen(genId, id);
    if(upg) {
        if(upg.active) {
            upg.active = false;
        } else {
            upg.active = true;
        }
    }
    return upg && upg.active;
}

function user_can_buy_upg(genId, id) {
    let upg = getUpgradeDataFromGen(genId,id);
    if(upg) {
        if(get_user_satisfaction() >= upg.cost) {
            return true;
        }
    }
    return false;
}

function get_auto_upgrade_of(genId) {
    let auto_gen = getGeneratorWithAuto().find( g => g.id = genId);
    if(auto_gen) {
        let user_gen = user_data.gen.find(g => g.genId === genId);
        if(user_gen && user_gen.upgrade) {
            return user_gen.upgrade.find(u => u.id === auto_gen.upgrade.id);
        }
    }
    return null;
}

function get_user_gen(genId) {
    return user_data.gen.find( g => g.genId === genId);
}

function froze_user_gen(genId) {
    let u_gen = get_user_gen(genId);
    if(u_gen) {
        u_gen.frozen = true;
    }
}
function unfroze_user_gen(genId) {
    let u_gen = get_user_gen(genId);
    if(u_gen) {
        u_gen.frozen = false;
    }
}
// ====================================================
function unlockAndLockUpgrades() {
    $(".generator .upgrade button").each(function() {
        let genId = $($(this).parents(".generator").get(0)).data('id');
        let gen = user_data.gen.find(elem => elem.genId === genId)
        if(gen) {
            let upg = gen.upgrade.find(up => up.id === $(this).data('id'));
            if(upg && upg.unlocked === true) {
                $(this).removeClass('locked');
                $(this).addClass('unlocked');
                $(this).prop('disabled',false);
            } else {
                $(this).removeClass('unlocked');
                $(this).addClass('locked');
                $(this).prop('disabled',!user_can_buy_upg(genId, $(this).data('id')));
            }
        } else {
            $(this).removeClass('unlocked');
            $(this).addClass('locked');
            $(this).prop('disabled',!user_can_buy_upg(genId, $(this).data('id')));
        }     
    }); 
        
}

function unlockAndLockGenerators() {
    $(".generator").each( function () {
        let generator = getGeneratorsData().find( (elem) => elem.id == $(this).data("id"));
        if(generator) {
            if(get_user_satisfaction() >= generator.unlock_pt) {
                if($(this).hasClass("locked")) {
                    unfroze_user_gen(generator.id);
                }
                $(this).removeClass("locked");
                $(this).addClass("unlocked");
            } else {
                if($(this).hasClass("unlocked")) {
                    froze_user_gen(generator.id);
                }
                $(this).removeClass("unlocked");
                $(this).addClass("locked");
            }
        }
    });
}
function updateSatisfaction() {
    $("#statisfactionNb").val(get_user_satisfaction());
}

function updateAutoGen() {
    $(".generator.unlocked .upgrade button[data-type='auto']").each(function() {
        let genId = $($(this).parents(".generator.unlocked").get(0)).data('id');
        let gen = user_data.gen.find(elem => elem.genId === genId)
        if(gen) {
            let upg = gen.upgrade.find(up => up.id === $(this).data('id'));
            if(upg) {
                if(upg.active && !$(this).hasClass("active")) {
                    $(this).addClass('active');
                } else if(!upg.active && $(this).hasClass("active")) {
                    $(this).removeClass('active');
                }
            }
        }
    });
}


function increaseBar(id, amount) {
    let bgbar = $(`#g-${id} .bgBar`);
    let w_prc = $(bgbar).data('prc');
    let final_w = w_prc + amount;
    $(bgbar).width(final_w >= 100 ? '100%' : `${final_w}%`);
    $(bgbar).data('prc',final_w >= 100 ? 0 : final_w);
    if(final_w >= 100) {
        setTimeout(() => {
            $(bgbar).width(0);
        }, 100);
        return 1;
    }
    return 0;
}
function increaseBarAndSatisfy(id, amount, award) {
    if(increaseBar(id,amount)) {
        increase_user_satisfaction(award);
    }
}

/**
 * TODO
 */
function updateBG() {
    let sat = get_user_satisfaction();
}

// ================== LOOP FUNC ====================
function autoGen(delta) {
    let unlck_auto_upg = [];
    let gens = getGeneratorWithAuto();
    user_data.gen.filter( e => e.frozen === false).forEach( (el) => {
        let idx = gens.findIndex( elem => elem.genId === el.genId);
        if(idx >= 0) {
            if(el.upgrade.findIndex( u => u.id === gens[idx].upgrade.id && u.unlocked && u.active)>=0)
                unlck_auto_upg.push(gens[idx]);
        } 
    });
    unlck_auto_upg.forEach(obj => {
        increaseBarAndSatisfy(obj.genId, obj.upgrade.increment / ( (obj.upgrade.delay/1000) / (delta/1000) ), obj.upgrade.award);
    })
    //user_data.gen.filter( elem => elem.unlocked === true)
}

function update(interval) {
    unlockAndLockGenerators();
    unlockAndLockUpgrades();
    updateSatisfaction();
    updateAutoGen();
    
}
// =====================================================
$(function() {
    // =========== VAR ==============
    let generatorsData = getGeneratorsData();
    let middle = generatorsData.length / 2
    // ===============================
    
    // =========== HTML GEN ========== 
    generatorsData.forEach( (element,ind) => {
        if(ind < middle) {
            $(getTemplate(element)).appendTo($(".col")[0]);
        } else {
            $(getTemplate(element)).appendTo($(".col")[1]);
        }
    });
    // =================================

    // ============ INIT FUNC ==========
    load_user_data();
    updateSatisfaction();
    unlockAndLockGenerators();
    unlockAndLockUpgrades();
    // =================================

    // ========== LOOP FUNC ============
    setInterval(() => {update(50)}, 50);
    setInterval(() => {autoGen(100)}, 100);
    setInterval(save_user_data, 1000);
    // ==================================

    // ============== EVENTS ============
    $(".generatorButton").click(function() {
        if(increaseBarAndSatisfy($(this).data('id'), $(this).data('increment'),$(this).data('award'))) {
            
        }
    });
    $("#p100").click(function() {
        increase_user_satisfaction(100);
    });
    $("#m100").click(function() {
        increase_user_satisfaction(-100);
    });
    $(".upgrade button").click(function() {
        let genID = $(this).parents('.generator').data('id');
        let id = $(this).data('id');
        let type = $(this).data('type');
        if($(this).hasClass("unlocked")) {
            if($(this).data('type')==='auto') {
                let new_state = change_auto_gen_of(genID,id);
                if(new_state) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            }
        }
        if(!did_user_unlocked_upgrade(genID,id)) {
            add_user_upgrade(genID,id,type);    
        }
    });
    // =================================
});