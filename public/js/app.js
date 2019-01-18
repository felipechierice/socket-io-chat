var app = angular.module('tungle', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider

  // Página inicial
  .when('/', {
    templateUrl: 'partials/index.html',
    controller: 'indexController'
  })

  // Página de chat
  .when('/chat', {
    templateUrl: 'partials/chat.html',
    controller: 'chatController'
  })
});

app.controller('mainController', function($scope, $rootScope) {

});

app.controller('indexController', function($scope, $rootScope, $location) {
  $location.path('/chat');
});

app.controller('chatController', function($scope, $rootScope) {
  const socket = io('http://localhost:3000');

  socket.on('receivedMessage', messageObj => {
    renderMessage(messageObj);
  })

  $('#chat').submit(function(e) {
    e.preventDefault();

    const author = $('#username').val();
    const message = $('#message').val();

    if(author.length && message.length) {
      const messageObject = {author, message};
      socket.emit('sendMessage', messageObject);
      renderMessage(messageObject);
      $('#message').val('');
    }
  });

  renderMessage = (messageObj) => {
    $('#messages').append("\
      <div class=\"w-100 d-flex mb-2\">\
        <div class=\"card p-2 shadow-sm" + (messageObj.author == $('#username').val() ? " ml-auto my-message" : "") + "\">\
          <strong>" + messageObj.author + "</strong>" + messageObj.message + "\
        </div>\
      </div>\
    ");

    $('#messages').animate({
      scrollTop: $(document).height()
    }, 'slow');
  }
});