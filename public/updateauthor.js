function updateAuthor(id){
    $.ajax({
        url: '/books/updateAuthor/' + id,
        type: 'PUT',
        data: $('#update-author').serialize(),
        success: function(result){
            window.location.replace("/books/book");
        }
    })
};