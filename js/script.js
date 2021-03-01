// call API to get all villager data
const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
.then(function(data) {
    data.forEach(function(vill) {
        render(vill);
    })
}, function(err) {
    console.log('Error ', err);
});

// render villager to page
function render(villagerData) {
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
    $('main').find('.expanded-info').css('display', 'none');
}

// toggle view of villager card
$('main').on('click', '.villager-title', function(evt) {
    let $target = $(evt.target);

    if ($target[0].nodeName === 'DIV') {
        $target.next().toggle();
    } else {
        $target.parent().next().toggle();
    }
});