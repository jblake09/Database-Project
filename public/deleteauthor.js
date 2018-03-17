function deleteAuthor(id){
    $.ajax({
        url: '/books/deleteAuthor/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};