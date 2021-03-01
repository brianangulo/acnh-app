// cached elements
const $searchInput = $('#search-input');
const $searchButton = $('#search-button');
const $speciesLink = $('#species-link');
const $genderLink = $('#gender-link');
const $personalityLink = $('#personality-link');

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


// event handlers
$('main').on('click', '.villager-title', toggleDetails);
$('form').on('submit', handleSubmit);
$speciesLink.on('click', handleClick);
// $genderLink.on('click', );
// $personalityLink.on('click', );


// functions
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
};

function toggleDetails(evt) {
    let $target = $(evt.target);
    let $expandedInfo;
    
    if ($target[0].nodeName === 'DIV') {
        $expandedInfo = $target.next();
    } else {
        $expandedInfo = $target.parent().next();
    };
    
    if ($expandedInfo.hasClass('hidden')) {
        $expandedInfo.fadeIn();
        $expandedInfo.removeClass('hidden');
    } else {
        $expandedInfo.fadeOut();
        $expandedInfo.addClass('hidden');
    };
};

function handleSubmit(evt) {
    evt.preventDefault();
    
    $('main').html('');
    
    let userInput = $searchInput.val().toLowerCase();
    
    let query = userInput.charAt(0).toUpperCase() + userInput.slice(1);
    
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let villIndex = data.findIndex(function(vill) {
            return vill.name['name-USen'] === query; 
        });
        
        if (villIndex !== -1) {
            render(data[villIndex]);
            
            $('.expanded-info').show();
            $('.expanded-info').removeClass('.hidden');
        } else {
            $('main').html(`<p>Sorry, villager "${query}" not found. Check spelling and try again.</p>`);
        }
        
    }, function(err) {
        console.log('Error ', err);
    });
};

function handleClick() {

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let species = [];
        data.forEach(function(vill) {
            if (!species.includes(vill.species)) {
                species.push(vill.species);
            }
        });

        species.sort(function(a, b) {
            if (a < b) {
                return -1
            } else if (a > b) {
                return 1;
            } else {
                return;
            }
        })

        $('main').html('');
        species.forEach(function(animal) {
            renderSpecies(animal);
        })
    }, function(err) {
        console.log('Error ', err);
    });
}

function renderSpecies(animal) {
    let $newSpecies = $(`<div class="species">
        <p class="species-name" id="${animal.toLowerCase()}">${animal}</p>
    </div>`);

    $('main').append($newSpecies);
}