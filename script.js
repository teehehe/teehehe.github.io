document.addEventListener('DOMContentLoaded', () => {
    const xmlFile = 'atlas_crafting_recipes.xml';
    const contentContainer = document.getElementById('content');
    const navContainer = document.querySelector('nav');
    const excludedSkills = ['Siegecraft', 'Jewelcraft', 'Gemcutting', 'Herbcrafting'];

    // Fetch and parse the XML file
    fetch(xmlFile)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');
            const realms = xml.querySelectorAll('Realm');

            realms.forEach(realm => {
                const realmName = realm.getAttribute('name');
                createRealmSection(realmName, realm); // Create section for each realm
            });
        });

    // Create a section for each realm
    function createRealmSection(realmName, realm) {
        const realmSection = document.createElement('section');
        realmSection.id = realmName;

        const realmHeader = document.createElement('h1');
        realmHeader.textContent = realmName;
        realmHeader.style.color = '#ffd700';
        realmHeader.style.textAlign = 'center';
        realmSection.appendChild(realmHeader);

        const skills = realm.querySelectorAll('Skill');
        skills.forEach(skill => {
            const skillName = skill.getAttribute('name');
            if (!excludedSkills.includes(skillName)) {
                createNavLink(skillName, realmName); // Add to navigation
                createSkillSection(skill, skillName, realmSection); // Add to realm section
            }
        });

        contentContainer.appendChild(realmSection);
    }

    // Create navigation links dynamically
    function createNavLink(skillName, realmName) {
        const link = document.createElement('a');
        link.href = `#${realmName}-${skillName}`;
        link.textContent = `${realmName}: ${skillName}`;
        navContainer.appendChild(link);
    }

    // Create skill section with collapsible feature
    function createSkillSection(skill, skillName, realmSection) {
        const section = document.createElement('section');
        section.id = `${realmSection.id}-${skillName}`;

        const header = document.createElement('h2');
        header.textContent = skillName;
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => toggleSection(section));
        section.appendChild(header);

        const items = skill.querySelectorAll('Item');
        items.forEach(item => {
            const itemName = item.getAttribute('name');
            const patterns = item.querySelectorAll('Pattern');
            patterns.forEach(pattern => {
                const recipeDiv = createRecipeDiv(itemName, pattern);
                section.appendChild(recipeDiv);
            });
        });

        realmSection.appendChild(section);
    }

    // Create individual recipe card
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

    // Toggle section visibility
    function toggleSection(section) {
        const recipes = section.querySelectorAll('.recipe');
        recipes.forEach(recipe => recipe.style.display = recipe.style.display === 'none' ? 'block' : 'none');
    }

    // Search and Filter functionality
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Search for recipes...';
    searchBar.style.margin = '10px';
    searchBar.addEventListener('input', event => {
        const query = event.target.value.toLowerCase();
        const recipes = document.querySelectorAll('.recipe');
        recipes.forEach(recipe => {
            const text = recipe.textContent.toLowerCase();
            recipe.style.display = text.includes(query) ? 'block' : 'none';
        });
    });
    document.body.insertBefore(searchBar, contentContainer);
});
