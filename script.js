document.addEventListener('DOMContentLoaded', () => {
    const xmlFile = 'atlas_crafting_recipes.xml';
    const contentContainer = document.getElementById('content');
    const sidebarList = document.getElementById('skillList');
    const searchBox = document.getElementById('searchBox');
    const excludedSkills = ['Siegecraft', 'Jewelcraft', 'Gemcutting', 'Herbcraft', 'Herbcrafting'];

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
        realmItem.addEventListener('click', () => showRealmSkills(realmName, realm));
        sidebarList.appendChild(realmItem);

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
                sidebarList.appendChild(skillItem);
            }
        });
    }

    // Show all skills for a selected realm
    function showRealmSkills(realmName, realm) {
        const realmContent = document.createElement('section');
        realmContent.innerHTML = `<h1>${realmName}</h1>`;

        const skills = realm.querySelectorAll('Skill');
        skills.forEach(skill => {
            const skillName = skill.getAttribute('name');
            const skillSection = createSkillSection(skillName, skill);
            realmContent.appendChild(skillSection);
        });

        contentContainer.innerHTML = ''; // Clear existing content
        contentContainer.appendChild(realmContent);
    }

    // Create a skill section (collapsed by default)
    function createSkillSection(skillName, skill) {
        const section = document.createElement('section');
        section.innerHTML = `<h2>${skillName}</h2>`;
        section.style.display = 'none'; // Start hidden

        const items = skill.querySelectorAll('Item');
        items.forEach(item => {
            const itemName = item.getAttribute('name');
            const patterns = item.querySelectorAll('Pattern');
            patterns.forEach(pattern => {
                const recipeDiv = createRecipeDiv(itemName, pattern);
                recipeDiv.style.display = 'none'; // Start hidden
                section.appendChild(recipeDiv);
            });
        });

        section.addEventListener('click', () => toggleSkillRecipes(section));
        return section;
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

    // Toggle recipes visibility under a skill
    function toggleSkillRecipes(skillSection) {
        const recipes = skillSection.querySelectorAll('.recipe');
        recipes.forEach(recipe => {
            recipe.style.display = recipe.style.display === 'none' ? 'block' : 'none';
        });
    }

    // Filter the sidebar list based on search input
    function filterList() {
        const searchTerm = searchBox.value.toLowerCase();
        const items = sidebarList.getElementsByTagName('li');
        Array.from(items).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }
});
