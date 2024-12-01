document.addEventListener('DOMContentLoaded', () => {
    const xmlFile = 'atlas_crafting_recipes.xml';
    const contentContainer = document.getElementById('content');
    const realmList = document.getElementById('realmList');
    const excludedSkills = ['siegecraft', 'jewelcraft', 'gemcutting', 'herbcrafting'];

    let realmsData = [];

    // Fetch and parse the XML file
    fetch(xmlFile)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');
            const realms = xml.querySelectorAll('Realm');

            realms.forEach(realm => {
                const realmName = realm.getAttribute('name');
                realmsData.push({ realmName, realm });
                createRealmInSidebar(realmName, realm); // Create realm in the sidebar
            });
        });

    // Create a realm link in the sidebar
    function createRealmInSidebar(realmName, realm) {
        const realmItem = document.createElement('li');
        realmItem.textContent = realmName;
        realmItem.classList.add(realmName.toLowerCase()); // Add class based on realm name for color
        realmItem.addEventListener('click', () => toggleRealmCollapse(realmItem, realm)); // Toggle collapse
        realmList.appendChild(realmItem);

        const skillsList = document.createElement('ul');
        const skills = realm.querySelectorAll('Skill');
        skills.forEach(skill => {
            const skillName = skill.getAttribute('name').toLowerCase();
            if (!excludedSkills.includes(skillName)) { // Exclude specific skills
                const skillItem = document.createElement('li');
                skillItem.textContent = skill.getAttribute('name');
                skillItem.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent realm collapse toggle
                    showSkillRecipes(realmName, skill.getAttribute('name'), skill);
                });
                skillsList.appendChild(skillItem);
            }
        });

        realmItem.appendChild(skillsList);
    }

    // Toggle collapse/expand for a realm
    function toggleRealmCollapse(realmItem, realm) {
        const skillsList = realmItem.querySelector('ul');
        const isCollapsed = realmItem.classList.contains('collapsed');
        if (isCollapsed) {
            skillsList.style.display = 'block';
            realmItem.classList.remove('collapsed');
        } else {
            skillsList.style.display = 'none';
            realmItem.classList.add('collapsed');
        }
    }

    // Show recipes for the selected skill
    function showSkillRecipes(realmName, skillName, skill) {
        const skillContent = document.createElement('section');
        skillContent.innerHTML = `<h1 class="realm-${realmName.toLowerCase()}">${realmName} - ${skillName}</h1>`; // Color based on realm

        const items = skill.querySelectorAll('Item');
        items.forEach(item => {
            const itemName = item.getAttribute('name');
            const patterns = item.querySelectorAll('Pattern');
            const itemDiv = createItemDiv(itemName, patterns, realmName);
            skillContent.appendChild(itemDiv);
        });

        contentContainer.innerHTML = ''; // Clear existing content
        contentContainer.appendChild(skillContent);
    }

    // Create an individual item card with collapsible patterns
    function createItemDiv(itemName, patterns, realmName) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'recipe';
        
        // Item name is collapsible, and should be collapsed by default
        itemDiv.innerHTML = `
            <h2 class="collapsible">${itemName}</h2>
            <div class="pattern-list" style="display:none;">
        `;

        patterns.forEach(pattern => {
            const patternName = pattern.getAttribute('name');
            const patternDiv = createPatternDiv(patternName, pattern);
            itemDiv.querySelector('.pattern-list').appendChild(patternDiv);
        });

        itemDiv.querySelector('h2').addEventListener('click', () => {
            const patternList = itemDiv.querySelector('.pattern-list');
            const isCollapsed = patternList.style.display === 'none';
            patternList.style.display = isCollapsed ? 'block' : 'none';
        });

        itemDiv.classList.add(`realm-${realmName.toLowerCase()}`); // Apply realm color class to items

        return itemDiv;
    }

    // Create a pattern card for an item, and make it collapsible (collapsed by default)
    function createPatternDiv(patternName, pattern) {
        const patternDiv = document.createElement('div');
        patternDiv.className = 'pattern';

        patternDiv.innerHTML = `
            <h3 class="collapsible">${patternName}</h3>
            <ul style="display:none;">
                ${Array.from(pattern.querySelectorAll('Ingredient')).map(ingredient => {
                    const ingredientName = ingredient.getAttribute('name');
                    const ingredientCategory = ingredient.getAttribute('cat') || 'No Category';  // Default to 'No Category' if 'cat' is missing
                    return `<li>${ingredientName} (${ingredientCategory}) - ${ingredient.getAttribute('quantity')}</li>`;
                }).join('')}
            </ul>
        `;

        patternDiv.querySelector('h3').addEventListener('click', () => {
            const ingredientList = patternDiv.querySelector('ul');
            const isCollapsed = ingredientList.style.display === 'none';
            ingredientList.style.display = isCollapsed ? 'block' : 'none';
        });

        return patternDiv;
    }
});
