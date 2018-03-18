function updateAward(id){
    $.ajax({
        url: '/books/updateAward/' + id,
        type: 'PUT',
        data: $('#update-award').serialize(),
        success: function(result){
            window.location.replace("/books/book");
        }
    })
};