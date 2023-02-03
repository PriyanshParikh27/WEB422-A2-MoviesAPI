/*********************************************************************************
* WEB422 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: _Priyansh Parikh_ Student ID: _158341214_ Date:_02-02-2023_
*
********************************************************************************/

let page = 1;
const perPage = 10;
//var url = 'https://cautious-puce-pelican.cyclic.app/';

function loadMovieData(title = null) {
    let url = title
        ? `https://cautious-puce-pelican.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`
        : `https://cautious-puce-pelican.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;

    const pagination = document.querySelector('.pagination')
    title ? pagination.classList.add("d-none") : pagination.classList.remove("d-none")
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            creatingtrElements(data);
            clickEventsToShowModal(data);
        })
}

function creatingtrElements(data) {
    let rowsOfMovies = `
    ${data.map(movie => (
        `<tr data-id=${movie._id}>
          <td>${movie.year}</td>
          <td>${movie.title}</td>
          <td>${movie.plot ? movie.plot : 'N\\A'}</td>
          <td>${movie.rated ? movie.rated : 'N\\A'}</td>
          <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
      </tr>`
    )).join('')}`;

    document.querySelector('#moviesTable tbody').innerHTML = rowsOfMovies;
    document.querySelector('#current-page').innerHTML = page;
}

function showList(data) {
    return `
    <strong>Directed By:</strong> ${data.directors.join(',')}<br><br>
    <p>${data.fullplot}</p>
    <strong>Cast:</strong> ${data.cast ? data.cast.join(',') : 'N\\A'}<br><br>
    <strong>Awards:</strong> ${data.awards.text}<br>
    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
    `;
}

function clickEventsToShowModal(data) {
    document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
        row.addEventListener('click', (e) => {
            let clickedId = row.getAttribute('data-id');
            fetch(`https://cautious-puce-pelican.cyclic.app/api/movies/${clickedId}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    let commentsList = "";
                    if (data.poster) {
                        commentsList = `                       
                    <img class="img-fluid w-100" src="${data.poster}"><br><br>`;
                        commentsList += showList(data);
                    }
                    else {
                        commentsList = showList(data);
                    }

                    document.querySelector('#detailsModal .modal-title').innerHTML = data.title;
                    document.querySelector('#detailsModal .modal-body').innerHTML = commentsList;

                    let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                        backdrop: 'static',
                        keyboard: false,
                        focus: true,
                    });
                    myModal.show();
                })
        })
    })
}

document.addEventListener('DOMContentLoaded', function () {
    loadMovieData();
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        event.preventDefault();
        page = 1;
        loadMovieData(document.querySelector('#title').value);
    });
    document.querySelector('#clearForm').addEventListener('click', (event) => {
        document.querySelector('#title').value = ""
        loadMovieData();
    });
    document.querySelector('#previous-page').addEventListener('click', (event) => {
        if (page > 1)
            page--;
        loadMovieData();
    });
    document.querySelector('#next-page').addEventListener('click', (event) => {
        page++;
        loadMovieData();
    });
});