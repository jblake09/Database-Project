function updateBook(id){
    $.ajax({
        url: '/books/' + id,
        type: 'PUT',
        data: $('#update-book').serialize(),
        success: function(result){
            window.location.replace("./book");
        }
    })
};