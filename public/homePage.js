'use strict';

//Выход из личного кабинета
let logoutButton = new LogoutButton();
logoutButton.action = () => {
    ApiConnector.logout(response => {
      if (response.success) {
        location.reload();
      } else {
        console.error(response.error); //нет отдельного метода под ошибку, как на странице логина/регистрации
      }
    });
};

//Получение информации о пользователе
ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

//Получение текущих курсов валюты
let ratesBoard = new RatesBoard();
function tableUpdate() {
  ApiConnector.getStocks(response => {
    if (response.success) {
      ratesBoard.clearTable(response.data);
      ratesBoard.fillTable(response.data);
    }
  });
}
tableUpdate();
setInterval(tableUpdate, 60000);

//Операции с деньгами
