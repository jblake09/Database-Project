function addAuthor(){
    $.ajax({
        url: '/authorAdd',
        type: 'POST',
        data: $('#addauthor').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};