const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
.then(function(data) {
    console.log(data);
    data.forEach(function(vill) {
        render(vill);
    })
}, function(err) {
    console.log('Error ', err);
});

function render(villagerData) {
    // console.log(villagerData['icon_uri']);
    // console.log(villagerData.name['name-USen']);
    // console.log(villagerData.species);
    // console.log(villagerData.gender);
    // console.log(villagerData['birthday-string']);
    // console.log(villagerData.personality);
    // console.log(villagerData['catch-phrase']);
    // console.log(villagerData['image_uri']);
    // console.log();

    
    let $newVillager = $(`<div class="villager">
    <div class='villager-title'>
        <img class="villager-icon" src="${villagerData['icon_uri']}">
        <p class="villager-name">${villagerData.name['name-USen']}</p>
    </div>
    <div class="expanded-info">
        <div class="villager-details">
            <p class="detail" id="species">Species: ${villagerData.species}</p>
            <p class="detail" id="gender">Gender: ${villagerData.gender}</p>
            <p class="detail" id="birthday">Birthday: ${villagerData['birthday-string']}</p>
            <p class="detail" id="personality">Personality: ${villagerData.personality}</p>
            <p class="detail" id="catchphrase">Catchphrase: ${villagerData['catch-phrase']}</p>
        </div>
        <img class="villager-img" src="${villagerData['image_uri']}">
    </div>
</div>`);

    $('main').append($newVillager);
}