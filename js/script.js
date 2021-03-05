// global variables
let availableMonths;
let availableTime;

// cached elements
const $searchInput = $('#search-input');
const $searchButton = $('#search-button');
const $allVillagersLink = $('#all-link');
const $speciesLink = $('#species-link');
const $genderLink = $('#gender-link');
const $personalityLink = $('#personality-link');
const $bugLink = $('#bug-link');
const $fishLink = $('#fish-link');
const $seaLink = $('#sea-link');
const $artLink = $('#art-link');
const $fossilLink = $('#fossil-link');



// event handlers
$('main').on('click', '.title', toggleDetails);
$('form').on('submit', handleSubmit);
$allVillagersLink.on('click', allVillagers);
$speciesLink.on('click', handleOptionClick);
$genderLink.on('click', handleOptionClick);
$personalityLink.on('click', handleOptionClick);
$('main').on('click', '.species', showVillOptions);
$('main').on('click', '.gender', showVillOptions);
$('main').on('click', '.personality', showVillOptions);
$bugLink.on('click', showOtherOptions);
$fishLink.on('click', showOtherOptions);
$seaLink.on('click', showOtherOptions);
$artLink.on('click', showOtherOptions);
$fossilLink.on('click', showOtherOptions);


// functions
// capitalize first letter of each word in a string
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

// renders villager to the page
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
    $('.expanded-info').removeClass('hidden');
};

// clear main page and set the h2 to prepare the page
function prepPage(h2Text) {
    if ($('body').find('h2').length) {
        $('h2').text(`${h2Text}`);
    } else {
        $(`<h2>${h2Text}</h2>`).insertBefore('main');
    };
    $('main').html('');
};

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
        if ($('main').find('.shown').length) {
            let prevVisible = $('.shown');
            $(prevVisible).fadeOut();
            setTimeout(function() {
                $(prevVisible).siblings('.title').css('border-bottom', '1px solid #6dbdb6');
                $(prevVisible).siblings('.title').css('margin-bottom', '8px');
            }, 400);
            $(prevVisible).addClass('hidden');
            $(prevVisible).removeClass('shown');
        }
        $title.css('border-bottom', 'hidden');
        $title.css('margin-bottom', '0');
        $expandedInfo.fadeIn();
        $expandedInfo.addClass('shown');
        $expandedInfo.removeClass('hidden');
    } else {
        $expandedInfo.fadeOut();
        $expandedInfo.addClass('hidden');
        $expandedInfo.removeClass('shown');
        setTimeout(function() {
            $title.css('border-bottom', '1px solid #6dbdb6');
            $title.css('margin-bottom', '8px');
        }, 400);
    };
};

// function to search from all things shown in app
function handleSubmit(evt) {
    evt.preventDefault();
    
    let userInput = $searchInput.val();
    let query = $searchInput.val().toLowerCase();
    $searchInput.val('');

    prepPage(`Search Results for "${userInput}"`);
    
    const endpoints = ['villagers', 'bugs', 'fish', 'sea', 'art', 'fossils'];
    endpoints.forEach(function(point) {
        const $data = $.ajax(`https://acnhapi.com/v1a/${point}/`)
        .then(function(data) {
            showSearchResults(data, query);
            
        }, function(err) {
            console.log('Error ', err);
        });
    });

    setTimeout(function() {
        if (!$('main').find('div').length) {
            $('main').html(`<p>Sorry, no results for "${userInput}." Check spelling and try again or browse through the navigation above.</p>`);
        };
    }, 500);
};

// finds object in api data and calls function to render on page
function showSearchResults(data, query) {
    let index = data.findIndex(function(element) {
        return element.name['name-USen'] === query; 
    });

    if (index !== -1) {
        let image = data[index]['image_uri']
        let type = image.split('/')[5];
        renderElement(data[index], type);
        autoShowDetails();
    } else {
        index = data.findIndex(function(element) {
            return element.name['name-USen'] === capitalize(query); 
        });

        if (index !== -1) {
            render(data[index]);
            autoShowDetails();
        }
    };
};

// lists all villagers on the page
function allVillagers() {
    prepPage('All Villagers');
    
    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        sortAlphabetically(data);
        data.forEach(function(vill) {
            render(vill);
        })
    }, function(err) {
        console.log('Error ', err);
    });
};

// shows all options to browse, to be used when species, gender, or personality are clicked in the nav
function handleOptionClick(evt) {
    let type = $(evt.target).attr('id').split('-link')[0];

    prepPage(`Browse by ${capitalize(type)}`);

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let optionArray = [];
        data.forEach(function(vill) {
            if (!optionArray.includes(vill[type])) {
                optionArray.push(vill[type]);
            }
        });
        
        sortAlphabetically(optionArray);
        optionArray.forEach(function(animal) {
            renderOption(animal, type);
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
function showVillOptions(evt) {
    let $target = capitalize($(evt.target).attr('id'));
    prepPage(`All ${$target} Villagers`);

    const $villagers = $.ajax('https://acnhapi.com/v1a/villagers/')
    .then(function(data) {
        let targetType = $(evt.target).parent().attr('class');
        let targetArray = [];
        targetArray = data.filter(vill => vill[targetType] === $target);
        sortAlphabetically(targetArray);
        targetArray.forEach(function(vill) {
            render(vill);
        });
    }, function(err) {
        console.log('Error ', err);
    });
};

// displays all critters and collectibles on the page
function showOtherOptions(evt) {
    let type = $(evt.target).attr('id').split('-link')[0];

    if (type === 'bug' || type === 'fossil') {
        type = type + 's';
    }
    prepPage(`All ${capitalize(type)}`);
    
    const $request = $.ajax(`https://acnhapi.com/v1a/${type}`)
    .then(function(data) {
        sortAlphabetically(data);

        data.forEach(function(element) {
            renderElement(element, type);
        })
    }, function(err) {
        console.log('Error', err);
    });
};

// turn the available months and time into readable format
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

// render critters and collectibles on the page
function renderElement(data, type) {
    let name = capitalize(data.name['name-USen']);
    let newElem = `<div>
    <div class='title'>`;
    
    if (type === 'bugs' || type === 'fish' || type === 'sea') {
        getAvailable(data);
        newElem += `<img class="icon" src="${data['icon_uri']}">
        <p class="name">${name}</p>
        </div>
        <div class="expanded-info">
        <div class="details">
        <p class="detail-label">Availability: </p>
        <p class="detail" id="availability">${availableMonths}</p>
        <p class="detail-label">Time: </p>
        <p class="detail" id="time">${availableTime}</p>`;
        if (type === 'bugs' || type === 'fish') {
            newElem += `<p class="detail-label">Location: </p>
            <p class="detail" id="location">${data.availability.location}</p>
            <p class="detail-label">Rarity: </p>
            <p class="detail" id="rarity">${data.availability.rarity}</p>`;
        } else if (type === 'sea') {
            newElem += `<p class="detail-label">Speed: </p>
            <p class="detail" id="speed">${data.speed}</p>
            <p class="detail-label">Shadow: </p>
            <p class="detail" id="shadow">${data.shadow}</p>`;
        }
        newElem += `<p class="detail-label">Price: </p>
        <p class="detail" id="price">${data.price} bells</p>`;
    } else if (type === 'art' || type === 'fossils') {
        newElem += `<p class="name no-icon">${name}</p>
        </div>
        <div class="expanded-info">
        <div class="details">`;
        if (type === 'art') {
            newElem += `<p class="detail-label">Buy Price: </p>
            <p class="detail" id="buy-price">${data['buy-price']} bells</p>
            <p class="detail-label">Sell Price: </p>
            <p class="detail" id="sell-price">${data['sell-price']} bells</p>
            <p class="detail-label">Description: </p>
            <p class="detail" id="description">${data['museum-desc']}</p>`;
        } else if (type === 'fossils') {
            newElem += `<p class="detail-label">Price: </p>
            <p class="detail" id="price">${data.price} bells</p>
            <p class="detail-label">Description: </p>
            <p class="detail" id="description">${data['museum-phrase']}</p>`;
        }
    }
    newElem += `</div>
    <div class="img-section">
    <img class="image" src="${data['image_uri']}">
    </div>
    </div>
    </div>`;

    let $newElement = $(newElem);
    $('main').append($newElement);
    $('main').find('.expanded-info').css('display', 'none');
    $('main').find('.expanded-info').addClass('hidden');
};

// sort array alphabetically
function sortAlphabetically(array) {
    array.sort(function(a, b) {
        if (typeof(a) === 'object') {
            a = a.name['name-USen'].toUpperCase();
            b = b.name['name-USen'].toUpperCase();
        }
        
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });
    return array;
};