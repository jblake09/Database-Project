function deleteBookAward(aid, bid){
    $.ajax({
        url: '/books/deleteAwardBook/aid/' + aid + '/bid/' + bid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};