function getCurrentDate() {
    const now = new Date();
    let dateParts = now.toString().split(' ');
    dateParts[4] = dateParts[4].slice(0, 5); // Keep only HH:MM
    let dateStr = `${dateParts[1]} ${dateParts[2]} ${dateParts[3]} ${dateParts[4]}`;

    return dateStr;
}

function getTimeAgo(dateStr) {
    const now = new Date();
    const past = new Date(dateStr);

    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays === 1) return "1 day ago";

    return `${diffDays} days ago`;
}

function generateCard(id, cardTitle, date) {
    const card = document.createElement('div');
    card.className = 'cardLTI';
    card.id = id;

    card.innerHTML = `
        <div class="cardHeader">
            <h4>${cardTitle}</h4>
            <button class="dateUpdate">+</button>
        </div>

        <p class="lt">
            LT: ${date} <span class="ago">(${getTimeAgo(date)})</span>
        </p>
    `;

    const btn = card.querySelector('.dateUpdate');
    btn.addEventListener('click', () => {
        const newDate = getCurrentDate();
        const dateP = card.querySelector('.lt');
        const agoSpan = card.querySelector('.ago');

        if (dateP && agoSpan) {
            dateP.innerHTML = `LT: ${newDate} <span class="ago">(${getTimeAgo(newDate)})</span>`;
        }

        // Update file
        const dataUpdate = new FormData();
        dataUpdate.append('name', id);
        dataUpdate.append('date', newDate);

        fetch('save.php', {
            method: 'POST',
            body: dataUpdate
        });
    });

    return card;
}

const container = document.getElementById('cardsDivLTI');

// Manage add section
const addPannel = document.getElementById('addPannel');
const btnAddLTI = document.getElementById('btnAddLTI');
const btnAddThing = document.getElementById('btnAddThing');

btnAddLTI.onclick = () => {
    if (addPannel.style.display === 'none') {
        addPannel.style.display = 'block';
        btnAddLTI.textContent = '▲';
    } else {
        addPannel.style.display = 'none';
        btnAddLTI.textContent = '▼';
    }
}

btnAddThing.onclick = () => {
    const newThing = document.getElementById('thingToAdd').value.trim();
    if (!newThing)
        return;

    const saveThingName = newThing.toLowerCase().replaceAll(' ', '_');

    // Prevent duplicate cards
    if (document.getElementById(saveThingName)) {
        alert("Card already exists");
        return;
    }

    const date = getCurrentDate();

    const dataToSend = new FormData();
    dataToSend.append('name', saveThingName);
    dataToSend.append('date', date);

    // Save to file
    fetch('save.php', {
        method: 'POST',
        body: dataToSend
    });

    const newCard = generateCard(saveThingName, newThing, date);
    container.appendChild(newCard);

    document.getElementById('thingToAdd').value = '';
}

window.onload = async () => {
    const response = await fetch('load.php');
    const savedThings = await response.json();

    savedThings.forEach(thing => {
        let displayName = thing.id.replaceAll('_', ' ');
        displayName = displayName[0].toUpperCase() + displayName.slice(1);

        const card = generateCard(thing.id, displayName, thing.date);
        container.appendChild(card);
    });
}