document.addEventListener('DOMContentLoaded', () => {
    const xmlFile = 'atlas_crafting_recipes.xml';
    const contentContainer = document.getElementById('content');
    const realmList = document.getElementById('realmList');
    const skillList = document.getElementById('skillList');
    const searchBox = document.getElementById('searchBox');
    const excludedSkills = ['Siegecraft', 'Jewelcraft', 'Gemcutting', 'Herbcraft', 'Herbcrafting'];

    let selectedRealm = null;

    // Fetch and parse the XML file
    fetch(xmlFile)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');
            const realms = xml.querySelectorAll('Realm');

            realms.forEach(realm => {
                const realmName = realm.getAttribute('name');
                createRealmInSidebar(realmName, realm); // Create realm in the sidebar
            });
        });

    // Create a realm link in the sidebar
    function createRealmInSidebar(realmName, realm) {
        const realmItem = document.createElement('li');
        realmItem.textContent = realmName;
        realmItem.style.fontSize = '18px';
        realmItem.style.fontWeight = 'bold';
        realmItem.addEventListener('click', () => showSkillsInSidebar(realmName, realm));
        realmList.appendChild(realmItem);
    }

    // Show skills for the selected realm
    function showSkillsInSidebar(realmName, realm) {
        selectedRealm = realm;
        skillList.style.display = 'block'; // Show the skills list
        skillList.innerHTML = ''; // Clear previous skills list

        const skills = realm.querySelectorAll('Skill');
        skills.forEach(skill => {
            const skillName = skill.getAttribute('name');
            if (!excludedSkills.includes(skillName.toLowerCase())) {
                const skillItem = document.createElement('li');
                skillItem.textContent = skillName;
                skillItem.style.fontSize = '16px';
                skillItem.addEventListener('click', (event) => {
                    event.stopPropagation();
                    showSkillRecipes(realmName, skillName, skill);
                });
                skillList.appendChild(skillItem);
            }
        });
    }

    // Show recipes for the selected skill
    function showSkillRecipes(realmName, skillName, skill) {
        const skillContent = document.createElement('section');
        skillContent.innerHTML = `<h1>${realmName} - ${skillName}</h1>`;

        const items = skill.querySelectorAll('Item');
        items.forEach(item => {
            const itemName = item.getAttribute('name');
            const patterns = item.querySelectorAll('Pattern');
            patterns.forEach(pattern => {
                const recipeDiv = createRecipeDiv(itemName, pattern);
                skillContent.appendChild(recipeDiv);
            });
        });

        contentContainer.innerHTML = ''; // Clear existing content
        contentContainer.appendChild(skillContent);
    }

    // Create an individual recipe card
    function createRecipeDiv(itemName, pattern) {
        const patternName = pattern.getAttribute('name');
        const skill = pattern.getAttribute('skill');
        const ingredients = pattern.querySelectorAll('Ingredient');

        const recipeDiv = document.createElement('div');
        recipeDiv.className = 'recipe';
        recipeDiv.innerHTML = `
            <h3>${itemName}: ${patternName}</h3>
            <p>Skill: ${skill}</p>
            <ul>
                ${Array.from(ingredients).map(ing => `<li>${ing.getAttribute('quantity')}x ${ing.getAttribute('name')}</li>`).join('')}
            </ul>
        `;
        return recipeDiv;
    }

    // Filter the sidebar list based on search input
    function filterList() {
        const searchTerm = searchBox.value.toLowerCase();
        const realmItems = realmList.getElementsByTagName('li');
        const skillItems = skillList.getElementsByTagName('li');
        
        // Filter realms
        Array.from(realmItems).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });

        // Filter skills
        Array.from(skillItems).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }
});
