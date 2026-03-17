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
            <div class="cardActions">
                <button class="menuBtn">...</button>
                <button class="dateUpdate">+</button>
            </div>
        </div>

        <p class="lt">
            LT: ${date} <span class="ago">(${getTimeAgo(date)})</span>
        </p>
    `;

    // Manage menu (... button)
    const menuBtn = card.querySelector('.menuBtn');
    menuBtn.addEventListener('click', () => {
        const existing = document.querySelector('.actionMenu');
        if (existing) {
            existing.remove();
            return;
        }

        const container = document.createElement('div');
        container.className = 'actionMenu';

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Delete';

        const btnBack = document.createElement('button');
        btnBack.textContent = 'Back';

        container.append(btnDelete, btnBack);

        card.insertAdjacentElement('afterend', container);

        btnDelete.onclick = () => {
            const dataToSend = new FormData();
            dataToSend.append('action', 'delete');
            dataToSend.append('name', card.id);

            fetch('save.php', {
                method: 'POST',
                body: dataToSend
            }).then(() => location.reload());
        };

        btnBack.onclick = () => {
            const dataToSend = new FormData();
            dataToSend.append('action', 'undo');
            dataToSend.append('name', card.id);

            fetch('save.php', {
                method: 'POST',
                body: dataToSend
            }).then(() => location.reload());
        };
    });  

    // Manage date update (+ button)
    const updateBtn = card.querySelector('.dateUpdate');
    updateBtn.addEventListener('click', () => {
        const newDate = getCurrentDate();
        const dateP = card.querySelector('.lt');
        const agoSpan = card.querySelector('.ago');

        if (dateP && agoSpan) {
            dateP.innerHTML = `LT: ${newDate} <span class="ago">(${getTimeAgo(newDate)})</span>`;
        }

        // Update file
        const dataUpdate = new FormData();
        dataUpdate.append('action', 'update');
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