const usernameInput = document.getElementById('usernameInput');
const repositoriesContainer = document.getElementById('repositoriesContainer');
const paginationContainer = document.getElementById('paginationContainer');
const loader = document.getElementById('loader');

const itemsPerPageOptions = [10, 20, 50, 100];
let currentPage = 1;
let itemsPerPage = itemsPerPageOptions[0];
let repositoriesData = []; 

async function fetchGithubRepositories() {
    const username = usernameInput.value.trim();

    if (username) {
        try {
            showLoader();

            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
            const repositories = await response.json();

            repositoriesData = repositories; 
            hideLoader();
            displayRepositories();
        } catch (error) {
            console.error('Error fetching Github repositories:', error);
            hideLoader();
        }
    }
}

function displayRepositories() {
    repositoriesContainer.innerHTML = '';

    const repositoriesPerPage = itemsPerPage;
    const totalPages = Math.ceil(repositoriesData.length / repositoriesPerPage);

    const startIndex = (currentPage - 1) * repositoriesPerPage;
    const endIndex = startIndex + repositoriesPerPage;
    const currentRepositories = repositoriesData.slice(startIndex, endIndex);

    const row = document.createElement('div');
    row.classList.add('row');

    currentRepositories.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('col-md-6', 'mb-3'); 

        const card = document.createElement('div');
        card.classList.add('card', 'border', 'border-dark');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const repoName = document.createElement('h5');
        repoName.classList.add('card-title', 'text-primary'); 
        repoName.textContent = repo.name;

        const repoDescription = document.createElement('p');
        repoDescription.classList.add('card-text');
        repoDescription.textContent = repo.description || 'No description available.';

        const repoTopics = document.createElement('p');
        repoTopics.classList.add('card-text');
        repoTopics.textContent = `Topics: ${repo.topics.join(', ') || 'No topics available.'}`;

        cardBody.appendChild(repoName);
        cardBody.appendChild(repoDescription);
        cardBody.appendChild(repoTopics);

        card.appendChild(cardBody);
        repoCard.appendChild(card);
        row.appendChild(repoCard);
    });

    repositoriesContainer.appendChild(row);

    paginationContainer.innerHTML = '';
    const pagination = document.createElement('ul');
    pagination.classList.add('pagination');

    const previousButton = createPaginationButton('Previous', currentPage > 1 ? currentPage - 1 : 1);
    pagination.appendChild(previousButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(i, i);
        pagination.appendChild(pageButton);
    }

    const nextButton = createPaginationButton('Next', currentPage < totalPages ? currentPage + 1 : totalPages);
    pagination.appendChild(nextButton);

    paginationContainer.appendChild(pagination);
}

function createPaginationButton(label, page) {
    const button = document.createElement('li');
    button.classList.add('page-item');

    const link = document.createElement('a');
    link.classList.add('page-link');
    link.textContent = label;

    link.addEventListener('click', () => {
        currentPage = page;
        fetchGithubRepositories();
    });

    button.appendChild(link);

    return button;
}


function showLoader() {
    loader.style.display = 'block';
}

function hideLoader() {
    loader.style.display = 'none';
}

usernameInput.addEventListener('change', fetchGithubRepositories);
