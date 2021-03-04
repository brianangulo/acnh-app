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
$('main').on('click', '.species', showOptions);
$('main').on('click', '.gender', showOptions);
$('main').on('click', '.personality', showOptions);
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

// expand details automatically, to be used when searching
function autoShowDetails() {
    $('.title').css('border-bottom', 'hidden');
    $('.title').css('margin-bottom', '0');
    $('.expanded-info').show();
    $('.expanded-info').removeClass('.hidden');
}

// clear main page and set the h2 to prepare the page
function prepPage(h2Text) {
    if ($('body').find('h2').length) {
        $('h2').text(`${h2Text}`);
    } else {
        $(`<h2>${h2Text}</h2>`).insertBefore('main');
    };
    $('main').html('');
}

// toggle the detail section show/hide, to be used when clicking the title
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

// function to search from all things shown in app
function handleSubmit(evt) {
    evt.preventDefault();
    
    let userInput = $searchInput.val()
    let query = $searchInput.val().toLowerCase();
    let capitalQuery = capitalize(query);
    $searchInput.val('');

    prepPage(`Search Results for "${userInput}"`);
    
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let index = data.findIndex(function(element) {
            return element.name['name-USen'] === capitalQuery; 
        });

        if (index !== -1) {
            render(data[index]);
            autoShowDetails();
        }  
    }, function(err) {
        console.log('Error ', err);
    });

    const $bugs = $.ajax('https://acnhapi.com/v1a/bugs/')
    .then(function(data) {
        let index = data.findIndex(function(element) {
            return element.name['name-USen'] === query; 
        });

        if (index !== -1) {
            renderElement(data[index]);
            autoShowDetails();
        }      
    }, function(err) {
        console.log('Error ', err);
    });

    const $fish = $.ajax('https://acnhapi.com/v1a/fish/')
    .then(function(data) {
        let index = data.findIndex(function(element) {
            return element.name['name-USen'] === query; 
        });

        if (index !== -1) {
            renderElement(data[index]);
            autoShowDetails();
        }     
    }, function(err) {
        console.log('Error ', err);
    });

    const $sea = $.ajax('https://acnhapi.com/v1a/sea/')
    .then(function(data) {
        let index = data.findIndex(function(element) {
            return element.name['name-USen'] === query; 
        });

        if (index !== -1) {
            renderSea(data[index]);
            autoShowDetails();
        }     
    }, function(err) {
        console.log('Error ', err);
    });

    const $art = $.ajax('https://acnhapi.com/v1a/art/')
    .then(function(data) {
        let index = data.findIndex(function(element) {
            return element.name['name-USen'] === query; 
        });

        if (index !== -1) {
            renderArt(data[index]);
            autoShowDetails();
        }     
    }, function(err) {
        console.log('Error ', err);
    });

    const $fossils = $.ajax('https://acnhapi.com/v1a/fossils/')
    .then(function(data) {
        let index = data.findIndex(function(element) {
            return element.name['name-USen'] === query; 
        });

        if (index !== -1) {
            renderFossil(data[index]);
            autoShowDetails();
        }     
    }, function(err) {
        console.log('Error ', err);
    });

    setTimeout(function() {
        if (!$('main').find('div').length) {
            $('main').html(`<p>Sorry, no results for "${userInput}." Check spelling and try again or browse through the navigation above.</p>`);
        };
    }, 540);
};

// lists all villagers on the page
function allVillagers() {
    prepPage('All Villagers');
    
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        sortByName(data);
        data.forEach(function(vill) {
            render(vill);
        })
    }, function(err) {
        console.log('Error ', err);
    });
};

// shows all species options to browse, to be used when species is clicked in the nav
function handleSpeciesClick() {
    prepPage('Browse by Species');

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let species = [];
        data.forEach(function(vill) {
            if (!species.includes(vill.species)) {
                species.push(vill.species);
            }
        });
        
        sortArray(species);
        species.forEach(function(animal) {
            renderOption(animal, 'species');
        })
    }, function(err) {
        console.log('Error ', err);
    });
};

// shows all gender options to browse, to be used when gender is clicked in the nav
function handleGenderClick() {
    prepPage('Browse by Gender');
    
    let genders = ['Female', 'Male'];
    genders.forEach(function(animal) {
        renderOption(animal, 'gender');
    });
};

// shows all personality options to browse, to be used when personality is clicked in the nav
function handlePersonalityClick() {
    prepPage('Browse by Personality');

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let personalities = [];
        data.forEach(function(vill) {
            if (!personalities.includes(vill.personality)) {
                personalities.push(vill.personality);
            }
        });
        
        sortArray(personalities);
        personalities.forEach(function(animal) {
            renderOption(animal, 'personality');
        })
    }, function(err) {
        console.log('Error ', err);
    });
};

// creates html element for each characteristic to browse by
function renderOption(input, className) {
    let $newOption = $(`<div class="${className}">
        <p class="sort-label-name" id="${input.toLowerCase()}">${input}</p>
    </div>`);

    $('main').append($newOption);
};

// displays all matching villagers based on characteristic
function showOptions(evt) {
    let $target = capitalize($(evt.target).attr('id'));
    prepPage(`All ${$target} Villagers`);

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let targetType = $(evt.target).parent().attr('class');
        let targetArray = [];
        targetArray = data.filter(vill => vill[targetType] === $target);
        sortByName(targetArray);
        targetArray.forEach(function(vill) {
            render(vill);
        });
    }, function(err) {
        console.log('Error ', err);
    });
};

function showBugs() {
    prepPage('All Bugs');

    const $bugs = $.ajax('https://acnhapi.com/v1a/bugs/')
    .then(function(data) {
        sortByName(data);

        data.forEach(function(bug) {
            renderElement(bug);
        })
    }, function(err) {
        console.log('Error', err);
    });
};

function showFish() {
    prepPage('All Fish');

    const $fish = $.ajax('https://acnhapi.com/v1a/fish/')
    .then(function(data) {
        sortByName(data);

        data.forEach(function(fish) {
            renderElement(fish);
        })
    }, function(err) {
        console.log('Error', err);
    });
};

function showSea() {
    prepPage('All Sea Creatures');
    
    const $sea = $.ajax('https://acnhapi.com/v1a/sea/')
    .then(function(data) {
        sortByName(data);

        data.forEach(function(sea) {
            renderSea(sea);
        });
    }, function(err) {
        console.log('Error', err);
    });
};

function showArt() {
    prepPage('All Art');

    const $art = $.ajax('https://acnhapi.com/v1a/art/')
    .then(function(data) {
        sortByName(data);

        data.forEach(function(art) {
            renderArt(art);
        });
    }, function(err) {
        console.log('Error', err);
    });
};

function showFossils() {
    prepPage('All Fossils');

    const $fossils = $.ajax('https://acnhapi.com/v1a/fossils/')
    .then(function(data) {
        sortByName(data);

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
            <p class="detail" id="buy-price">${data['buy-price']} bells</p>
            <p class="detail-label">Sell Price: </p>
            <p class="detail" id="sell-price">${data['sell-price']} bells</p>
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
            <p class="detail" id="price">${data.price} bells</p>
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