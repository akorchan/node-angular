var bookList = [
    {
        id: 1,
        title: 'javascript',
        author: 'Hass'
    },
    {
        id: 2,
        title: 'nodejs',
        author: 'James'
    },
    {
        id: 3,
        title: 'mongodb',
        author: 'Mike'
    },
    {
        id: 5,
        title: 'something',
        author: 'someone'
    },
    {
        id: 6,
        title: 'book',
        author: 'Author'
    },
    {
        id: 7,
        title: 'Journal',
        author: 'Journalist'
    },
    {
        id: 8,
        title: 'Magazine',
        author: 'Unknown'
    }
];

exports.findAll = function (req, res) {
    res.send(bookList);
};

exports.add = function (req, res) {
    var book = req.body;
    book.id = bookList.length + 1;
    bookList.push(book);
    res.send(book);
};
