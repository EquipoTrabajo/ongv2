$(document).ready(function () {
  $('#btnFollowCompany').click(function () {
    $.ajax({
      url: '/company/' + $('#idCompany').attr('data-idCompany') + '/follow',
      cache: false,
      contentType: false,
      processData: false,
      type: 'PUT',
      success: function(data){
          console.log(data);
          window.location.reload();
      }
    });
  });

  $('#btnFollowDre').click(function () {
    $.ajax({
      url: '/donationReceivingEntity/' + $('#idDre').attr('data-idDre') + '/follow',
      cache: false,
      contentType: false,
      processData: false,
      type: 'PUT',
      success: function(data){
          console.log(data);
          window.location.reload();
      }
    });
  });

  $('#btnFollowPerson').click(function () {
    $.ajax({
      url: '/user/' + $('#idPerson').attr('data-idPerson') + '/follow',
      cache: false,
      contentType: false,
      processData: false,
      type: 'PUT',
      success: function(data){
          console.log(data);
          window.location.reload();
      }
    });
  });
});