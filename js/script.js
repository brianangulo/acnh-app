// call API to get all villager data
const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
.then(function(data) {
    data.sort(function(a, b) {
            let nameA = a.name['name-USen'].toUpperCase();
            let nameB = b.name['name-USen'].toUpperCase();

            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        });

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
    $('main').find('.expanded-info').addClass('hidden');
}

// toggle view of villager card
$('main').on('click', '.villager-title', function(evt) {
    let $target = $(evt.target);
    let $expandedInfo;

    if ($target[0].nodeName === 'DIV') {
        $expandedInfo = $target.next();
    } else {
        $expandedInfo = $target.parent().next();
    }


    if ($expandedInfo.hasClass('hidden')) {
        $expandedInfo.fadeIn();
        $expandedInfo.removeClass('hidden');
    } else {
        $expandedInfo.fadeOut();
        $expandedInfo.addClass('hidden');
    }
});