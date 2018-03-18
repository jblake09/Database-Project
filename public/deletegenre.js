function deleteGenre(id){
    $.ajax({
        url: '/books/deleteGenre/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};