document.getElementById('searchButton').addEventListener('click', function() {
    const name = document.getElementById('nameInput').value;
    fetchNews(name);
});

function fetchNews(name) {
    const apiToken = 'BGH3Rv1BDB8HESBHtdq4WQZGtLwct598xeLV76BB';
    
    const today = new Date();
    let month = today.getMonth() + 1; // Months are zero-indexed
    
    if (month === 1) {
        month = 11;
    } else if (month === 2) {
        month = 12;
    } else {
        month -= 2;
    }
    
    // Format the date as YYYY-MM-DD
    const day = String(today.getDate()).padStart(2, '0'); // Ensure day has two digits
    const date = `${today.getFullYear()}-${String(month).padStart(2, '0')}-${day}`;
    // Create parameters for the API request
    const params = {
        api_token: apiToken,
        search: name,
        search_fields: 'title,description,keywords',
        language: 'en',
        published_after: date,
        limit: '3'
    };

    // Encode parameters into a query string
    const esc = encodeURIComponent;
    const query = Object.keys(params)
        .map(k => `${esc(k)}=${esc(params[k])}`)
        .join('&');

    // Fetch news articles from the API
    fetch(`https://api.thenewsapi.com/v1/news/all?${query}`, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayResults(data.data);
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            document.getElementById('results').innerHTML = '<p>Error fetching news articles.</p>';
        });
}

function displayResults(articles) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (articles.length === 0) {
        resultsDiv.innerHTML = '<p>No articles found.</p>';
        return;
    }

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');

        articleDiv.innerHTML = `
            <div class="right">
                <h2 class="articletitle">${article.title}</h2>
                <p class="articledescription">${article.description}</p>
                <div class="lc"><a class="articlelink" href="${article.url}" target="_blank">Read more</a></div>
            </div>
            <div class="image_div">
                <img class="articleimage" src="${article.image_url}" alt="news_image">
            </div>
        `;

        resultsDiv.appendChild(articleDiv);
    });
}