// global variables
let availableMonths;
let availableTime;

// cached elements
const $searchInput = $('#search-input');
const $searchButton = $('#search-button');
const $allVillagersLink = $('#all-villagers');
const $speciesLink = $('#species-link');
const $genderLink = $('#gender-link');
const $personalityLink = $('#personality-link');
const $bugLink = $('#bug-link');
const $fishLink = $('#fish-link');
const $seaLink = $('#sea-link');
const $artLink = $('#art-link');
const $fossilLink = $('#fossil-link');



// event handlers
$allVillagersLink.on('click', allVillagers);
$('main').on('click', '.title', toggleDetails);
$('form').on('submit', handleSubmit);
$speciesLink.on('click', handleSpeciesClick);
$genderLink.on('click', handleGenderClick);
$personalityLink.on('click', handlePersonalityClick);
$('main').on('click', '.species', showSpecies);
$('main').on('click', '.gender', showGenders);
$('main').on('click', '.personality', showPersonalities);
$bugLink.on('click', showBugs);
$fishLink.on('click', showFish);
$seaLink.on('click', showSea);
$artLink.on('click', showArt);
$fossilLink.on('click', showFossils);


// functions
function capitalize(name) {
    let capitalName;
    if (name.includes(' ')) {
        let words = name.split(' ');
        let capitalWords = [];
        words.forEach(function(word) {
            capitalWords.push(word.charAt(0).toUpperCase() + word.slice(1));
        });
        capitalName = capitalWords.join(' ');
    } else {
        capitalName = name.charAt(0).toUpperCase() + name.slice(1);
    }
    return capitalName;
};

function allVillagers() {
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        if ($('body').find('h2').length) {
            $('h2').text('All Villagers');
        } else {
            $(`<h2>All Villagers</h2>`).insertBefore('main');
        };
        $('main').html('');

        sortByName(data);
        data.forEach(function(vill) {
            render(vill);
        })
    }, function(err) {
        console.log('Error ', err);
    });
};

function render(villagerData) {
    let $newVillager = $(`<div class="villager">
    <div class='title'>
        <img class="icon" src="${villagerData['icon_uri']}">
        <p class="name">${villagerData.name['name-USen']}</p>
    </div>
    <div class="expanded-info">
        <div class="details">
            <p class="detail-label">Species: </p>
            <p class="detail" id="species">${villagerData.species}</p>
            <p class="detail-label">Gender: </p>
            <p class="detail" id="gender">${villagerData.gender}</p>
            <p class="detail-label">Birthday: </p>
            <p class="detail" id="birthday">${villagerData['birthday-string']}</p>
            <p class="detail-label">Personality: </p>
            <p class="detail" id="personality">${villagerData.personality}</p>
            <p class="detail-label">Catchphrase: </p>
            <p class="detail" id="catchphrase">"${villagerData['catch-phrase']}"</p>
        </div>
        <div class="img-section">
            <img class="image" src="${villagerData['image_uri']}">
        </div>
    </div>
</div>`);

    $('main').append($newVillager);
    $('main').find('.expanded-info').css('display', 'none');
    $('main').find('.expanded-info').addClass('hidden');
};

function toggleDetails(evt) {
    let $target = $(evt.target);
    let $title;
    let $expandedInfo;
    
    if ($target[0].nodeName === 'DIV') {
        $title = $target;
        $expandedInfo = $target.next();
    } else {
        $title = $target.parent();
        $expandedInfo = $target.parent().next();
    };
    
    if ($expandedInfo.hasClass('hidden')) {
        $title.css('border-bottom', 'hidden');
        $title.css('margin-bottom', '0');
        $expandedInfo.fadeIn();
        $expandedInfo.removeClass('hidden');
    } else {
        $expandedInfo.fadeOut();
        $expandedInfo.addClass('hidden');
        setTimeout(function() {
            $title.css('border-bottom', '1px solid #6dbdb6');
            $title.css('margin-bottom', '8px');
        }, 400);
    };
};

function handleSubmit(evt) {
    evt.preventDefault();
    
    $('main').html('');
    
    let userInput = $searchInput.val()
    let query = $searchInput.val().toLowerCase();
    query = capitalize(query);
    
    $searchInput.val('');

    if ($('body').find('h2').length) {
        $('h2').text(`Search Results for "${userInput}"`);
    } else {
        $(`<h2>Search Results for "${userInput}"</h2>`).insertBefore('main');
    };
    
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let villIndex = data.findIndex(function(vill) {
            return vill.name['name-USen'] === query; 
        });
        
        if (villIndex !== -1) {
            render(data[villIndex]);
            
            $('.title').css('border-bottom', 'hidden');
            $('.title').css('margin-bottom', '0');
            $('.expanded-info').show();
            $('.expanded-info').removeClass('.hidden');
        } else {
            $('main').html(`<p>Sorry, villager "${userInput}" not found. Check spelling and try again.</p>`);
        }
        
    }, function(err) {
        console.log('Error ', err);
    });
};

function handleSpeciesClick() {
    if ($('body').find('h2').length) {
        $('h2').text('Browse by Species');
    } else {
        $(`<h2>Browse by Species</h2>`).insertBefore('main');
    };

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let species = [];
        data.forEach(function(vill) {
            if (!species.includes(vill.species)) {
                species.push(vill.species);
            }
        });

        $('main').html('');
        
        sortArray(species);
        species.forEach(function(animal) {
            renderSpecies(animal);
        })
    }, function(err) {
        console.log('Error ', err);
    });
};

function renderSpecies(input) {
    let $newSpecies = $(`<div class="species">
    <p class="sort-label-name" id="${input.toLowerCase()}">${input}</p>
    </div>`);
    
    $('main').append($newSpecies);
};

function handleGenderClick() {
    if ($('body').find('h2').length) {
        $('h2').text('Browse by Gender');
    } else {
        $(`<h2>Browse by Gender</h2>`).insertBefore('main');
    };
    
    let genders = ['Female', 'Male'];
    
    $('main').html('');
    genders.forEach(function(gender) {
        renderGender(gender);
    });
}

function renderGender(input) {
    let $newGender = $(`<div class="gender">
        <p class="sort-label-name" id="${input.toLowerCase()}">${input}</p>
    </div>`);
    
    $('main').append($newGender);
}

function handlePersonalityClick() {
    if ($('body').find('h2').length) {
        $('h2').text('Browse by Personality');
    } else {
        $(`<h2>Browse by Personality</h2>`).insertBefore('main');
    };

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let personalities = [];
        data.forEach(function(vill) {
            if (!personalities.includes(vill.personality)) {
                personalities.push(vill.personality);
            }
        });

        $('main').html('');
        
        sortArray(personalities);
        personalities.forEach(function(animal) {
            renderPersonality(animal);
        })
    }, function(err) {
        console.log('Error ', err);
    });
};

function renderPersonality(input) {
    let $newPersonality = $(`<div class="personality">
        <p class="sort-label-name" id="${input.toLowerCase()}">${input}</p>
    </div>`);

    $('main').append($newPersonality);
};

function showSpecies(evt) {
    let $target = $(evt.target).attr('id');
    $target = capitalize($target);

    if ($('body').find('h2').length) {
        $('h2').text(`All ${$target} Villagers`);
    } else {
        $(`<h2>All ${$target} Villagers</h2>`).insertBefore('main');
    };

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let targetSpecies = data.filter(vill => vill.species === $target);

        sortByName(targetSpecies);

        $('main').html('');
        targetSpecies.forEach(function(vill) {
            render(vill);
        });

    }, function(err) {
        console.log('Error ', err);
    });
};

function showPersonalities(evt) {
    let $target = $(evt.target).attr('id');
    $target = capitalize($target);
    
    if ($('body').find('h2').length) {
        $('h2').text(`All ${$target} Villagers`);
    } else {
        $(`<h2>All ${$target} Villagers</h2>`).insertBefore('main');
    };
    
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let targetPersonality = data.filter(vill => vill.personality === $target);

        sortByName(targetPersonality);
    
        $('main').html('');
        targetPersonality.forEach(function(vill) {
            render(vill);
        })
    
    }, function(err) {
        console.log('Error ', err);
    });
};

function showGenders(evt) {
    let $target = $(evt.target).attr('id');
    $target = capitalize($target);

    if ($('body').find('h2').length) {
        $('h2').text(`All ${$target} Villagers`);
    } else {
        $(`<h2>All ${$target} Villagers</h2>`).insertBefore('main');
    };
    
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let targetGender = data.filter(vill => vill.gender === $target);
    
        sortByName(targetGender);
    
        $('main').html('');
        targetGender.forEach(function(vill) {
            render(vill);
        })
    
    }, function(err) {
        console.log('Error ', err);
    });
};

function showBugs() {
    if ($('body').find('h2').length) {
        $('h2').text(`All Bugs`);
    } else {
        $(`<h2>All Bugs</h2>`).insertBefore('main');
    };

    const $bugs = $.ajax('https://acnhapi.com/v1a/bugs/')
    .then(function(data) {
        sortByName(data);

        $('main').html('');
        data.forEach(function(bug) {
            renderElement(bug);
        })
    }, function(err) {
        console.log('Error', err);
    });
};

function showFish() {
    if ($('body').find('h2').length) {
        $('h2').text(`All Fish`);
    } else {
        $(`<h2>All Fish</h2>`).insertBefore('main');
    };

    const $fish = $.ajax('https://acnhapi.com/v1a/fish/')
    .then(function(data) {
        sortByName(data);

        $('main').html('');
        data.forEach(function(fish) {
            renderElement(fish);
        })
    }, function(err) {
        console.log('Error', err);
    });
};

function showSea() {
    if ($('body').find('h2').length) {
        $('h2').text(`All Sea Creatures`);
    } else {
        $(`<h2>All Sea Creatures</h2>`).insertBefore('main');
    };
    
    const $sea = $.ajax('https://acnhapi.com/v1a/sea/')
    .then(function(data) {
        sortByName(data);

        $('main').html('');
        data.forEach(function(sea) {
            renderSea(sea);
        });
    }, function(err) {
        console.log('Error', err);
    });
};

function showArt() {
    if ($('body').find('h2').length) {
        $('h2').text(`All Art`);
    } else {
        $(`<h2>All Art</h2>`).insertBefore('main');
    };

    const $art = $.ajax('https://acnhapi.com/v1a/art/')
    .then(function(data) {
        sortByName(data);

        $('main').html('');
        data.forEach(function(art) {
            renderArt(art);
        });
    }, function(err) {
        console.log('Error', err);
    });
};

function showFossils() {
    if ($('body').find('h2').length) {
        $('h2').text(`All Fossils`);
    } else {
        $(`<h2>All Fossils</h2>`).insertBefore('main');
    };

    const $fossils = $.ajax('https://acnhapi.com/v1a/fossils/')
    .then(function(data) {
        sortByName(data);

        $('main').html('');
        data.forEach(function(fossil) {
            renderFossil(fossil);
        });
    }, function(err) {
        console.log('Error', err);
    });
};

function getAvailable(data) {
    let monthsArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    availableMonths = data.availability['month-northern'];
    if (!availableMonths) {
        availableMonths = 'All Year';
    } else if (availableMonths.includes('&')) {
        availableMonths = availableMonths.split(' & ');
        let first = availableMonths[0];
        first = first.split('-');
        let second = availableMonths[1];
        second = second.split('-');

        availableMonths = `${monthsArray[first[0] - 1]} - ${monthsArray[first[1] - 1]} ${'&'} ${monthsArray[second[0] - 1]} - ${monthsArray[second[1] - 1]}`
    } else {
        availableMonths = availableMonths.split('-');
        availableMonths = `${monthsArray[availableMonths[0] - 1]} - ${monthsArray[availableMonths[1] - 1]}`
    }
    
    availableTime = data.availability.time;
    if (!availableTime) {
        availableTime = 'All Day';
    };
};

function renderElement(data) {
    getAvailable(data);
    let name = capitalize(data.name['name-USen']);
    let $newElement = $(`<div>
    <div class='title'>
        <img class="icon" src="${data['icon_uri']}">
        <p class="name">${name}</p>
    </div>
    <div class="expanded-info">
        <div class="details">
            <p class="detail-label">Availability: </p>
            <p class="detail" id="availability">${availableMonths}</p>
            <p class="detail-label">Time: </p>
            <p class="detail" id="time">${availableTime}</p>
            <p class="detail-label">Location: </p>
            <p class="detail" id="location">${data.availability.location}</p>
            <p class="detail-label">Rarity: </p>
            <p class="detail" id="rarity">${data.availability.rarity}</p>
            <p class="detail-label">Price: </p>
            <p class="detail" id="price">${data.price} bells</p>
        </div>
        <div class="img-section">
            <img class="image" src="${data['image_uri']}">
        </div>
    </div>
</div>`);

    $('main').append($newElement);
    $('main').find('.expanded-info').css('display', 'none');
    $('main').find('.expanded-info').addClass('hidden');
};

function renderSea(data) {
    getAvailable(data);
    let name = capitalize(data.name['name-USen']);

    let $newElement = $(`<div>
    <div class='title'>
        <img class="icon" src="${data['icon_uri']}">
        <p class="name">${name}</p>
    </div>
    <div class="expanded-info">
        <div class="details">
            <p class="detail-label">Availability: </p>
            <p class="detail" id="availability">${availableMonths}</p>
            <p class="detail-label">Time: </p>
            <p class="detail" id="time">${availableTime}</p>
            <p class="detail-label">Speed: </p>
            <p class="detail" id="speed">${data.speed}</p>
            <p class="detail-label">Shadow: </p>
            <p class="detail" id="shadow">${data.shadow}</p>
            <p class="detail-label">Price: </p>
            <p class="detail" id="price">${data.price} bells</p>
        </div>
        <div class="img-section">
            <img class="image" src="${data['image_uri']}">
        </div>
    </div>
</div>`);

    $('main').append($newElement);
    $('main').find('.expanded-info').css('display', 'none');
    $('main').find('.expanded-info').addClass('hidden');    
};

function renderArt(data) {
    let name = capitalize(data.name['name-USen']);

    let $newArt = $(`<div>
    <div class='title'>
        <p class="name no-icon">${name}</p>
    </div>
    <div class="expanded-info">
        <div class="details">
            <p class="detail-label">Buy Price: </p>
            <p class="detail" id="buy-price">${data['buy-price']}</p>
            <p class="detail-label">Sell Price: </p>
            <p class="detail" id="sell-price">${data['sell-price']}</p>
            <p class="detail-label">Description: </p>
            <p class="detail" id="description">${data['museum-desc']}</p>
        </div>
        <div class="img-section">
            <img class="image" src="${data['image_uri']}">
        </div>
    </div>
</div>`);

    $('main').append($newArt);
    $('main').find('.expanded-info').css('display', 'none');
    $('main').find('.expanded-info').addClass('hidden');
};

function renderFossil(data) {
    let name = capitalize(data.name['name-USen']);

    let $newFossil = $(`<div>
    <div class='title'>
        <p class="name no-icon">${name}</p>
    </div>
    <div class="expanded-info">
        <div class="details">
            <p class="detail-label">Price: </p>
            <p class="detail" id="price">${data.price}</p>
            <p class="detail-label">Description: </p>
            <p class="detail" id="description">${data['museum-phrase']}</p>
        </div>
        <div class="img-section">
            <img class="image" src="${data['image_uri']}">
        </div>
    </div>
</div>`);

    $('main').append($newFossil);
    $('main').find('.expanded-info').css('display', 'none');
    $('main').find('.expanded-info').addClass('hidden');
};

function sortByName(array) {
    array.sort(function(a, b) {
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
    return array;
};

function sortArray(array) {
    array.sort(function(a, b) {
        if (a < b) {
            return -1
        } else if (a > b) {
            return 1;
        } else {
            return;
        }
    });
    return array;
}