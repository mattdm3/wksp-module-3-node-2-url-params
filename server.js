// MY FILE

'use strict';

const express = require('express');

const morgan = require('morgan');

const { top50 } = require('./data/top50');
const { books } = require('./data/books');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// endpoints here




// SONGS

app.get('/top50', (req, res) => {
    res.render('pages/top50', {
        title: "Top 50 Songs Streams on Spotify",
        top50: top50

    });

})

app.get('/top50/popular-artist', (req, res) => {
    const artists = [];
    const artistCount = {};

    top50.forEach(function (song) {
        if (!artists.includes(song.artist)) {
            artists.push(song.artist)
        }
    })

    artists.forEach(function (artist) {
        let count = 0;
        top50.forEach(function (song) {
            if (song.artist === artist) count += 1;

        })
        artistCount[artist] = count;
    })

    const artistRank = [];
    Object.values(artistCount).forEach(function (count, id) {
        const artist = Object.keys(artistCount)[id];
        artistRank.push({
            artist: artist,
            count: count
        })
    })

    const mostPopularArtist = artistRank.sort((a, b) => a.count < b.count ? 1 : -1)[0].artist;

    res.render('pages/popular-artist', {
        title: 'Most Popular Artist',
        songs: top50.filter(song => song.artist === mostPopularArtist)
    });

})


app.get('/top50/song/:rank', (req, res) => {
    // make the # (call it rank), be equal to the req params.rank - 1
    const rank = req.params.rank - 1;
    // if the object of the top50 array is chosen render the song page with a title and a key value pair that is connected to the top50 object
    if (top50[rank]) {
        res.render("pages/songPage", {
            title: `Song #${top50[rank].rank}`,
            song: top50[rank]
        })
    } else if (rank > 1 || rank < 50) {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }


})

// books


app.get('/booksPage', (req, res) => {

    res.render('pages/booksPage', {
        title: "All Books",
        books: books
    })
})


app.get('/booksPage/:number', (req, res) => {
    const number = Number(req.params.number);
    let currentBook = {};
    books.forEach(book => {
        if (book.id === number) {
            currentBook = book;
        }
    });
    console.log(currentBook);
    res.render("pages/bookById", {
        title: "< Return Home",
        currentBook: currentBook
    })
})

app.get('/booksByGenre/:genre', (req, res) => {
    const genre = req.params.genre;
    let genreArray = [];
    books.forEach(book => {
        if (book.type === genre) {
            genreArray.push(book)
        }
    });
    res.render("pages/booksByGenre", {
        title: "< Return Home",
        genre: genre,
        selectedGenre: genreArray
    })
})


// handle 404s
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
