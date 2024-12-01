document.addEventListener('DOMContentLoaded', () => {
    const xmlFile = 'atlas_crafting_recipes.xml';
    const contentContainer = document.getElementById('content');
    const navContainer = document.querySelector('nav');

    fetch(xmlFile)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, 'application/xml');
            const skills = xml.querySelectorAll('Skill');

            skills.forEach(skill => {
                const skillName = skill.getAttribute('name');
                createNavLink(skillName);
                createSkillSection(skill, skillName);
            });
        });

    function createNavLink(skillName) {
        const link = document.createElement('a');
        link.href = `#${skillName}`;
        link.textContent = skillName;
        navContainer.appendChild(link);
    }

    function createSkillSection(skill, skillName) {
        const section = document.createElement('section');
        section.id = skillName;

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

        contentContainer.appendChild(section);
    }

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

    function toggleSection(section) {
        const recipes = section.querySelectorAll('.recipe');
        recipes.forEach(recipe => recipe.style.display = recipe.style.display === 'none' ? 'block' : 'none');
    }

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
