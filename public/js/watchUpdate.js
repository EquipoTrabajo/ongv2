$(document).ready(function () {
  var idUser = $('#userid-nav').attr('data-userid');
  $.get( "/user/" + idUser + "/achievement", function(data) {
      console.log(data);
    })
    .done(function(data) {
      console.log(data)
    })
    .fail(function(err) {
      console.log(err);
    })
    .always(function() {
      console.log('the achievement update request finished');
    });

  $.get( "/user/" + idUser + "/level", function(data) {
      console.log(data);
    })
    .done(function(data) {
      console.log(data)
    })
    .fail(function(err) {
      console.log(err);
    })
    .always(function() {
      console.log('the level update request finished');
    });
});