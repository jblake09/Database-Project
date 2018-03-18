function deleteAward(id){
    $.ajax({
        url: '/books/deleteAward/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};