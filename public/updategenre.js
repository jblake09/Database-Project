function updateGenre(id){
    $.ajax({
        url: '/books/updateGenre/' + id,
        type: 'PUT',
        data: $('#update-author').serialize(),
        success: function(result){
            window.location.replace("/books/book");
        }
    })
};