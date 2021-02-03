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
let moneyManager = new MoneyManager();
//пополнение
moneyManager.addMoneyCallback = data => {
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      moneyManager.setMessage(response.success, 'Пополнение счёта успешно произведено!');
      ProfileWidget.showProfile(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

//конвертирование
moneyManager.conversionMoneyCallback = data => {
  ApiConnector.convertMoney(data, response => {
    if (response.success) {
      moneyManager.setMessage(response.success, 'Конвертация валют успешно произведена!');
      ProfileWidget.showProfile(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

//перевод
moneyManager.sendMoneyCallback = data => {
  ApiConnector.transferMoney(data, response => {
    if (response.success) {
      moneyManager.setMessage(response.success, 'Перевод средств успешно произведён!');
      ProfileWidget.showProfile(response.data);
    } else {
      moneyManager.setMessage(response.success, response.error);
    }
  });
};

//Работа с избранным
let favoritesWidget = new FavoritesWidget();
//начальный список
ApiConnector.getFavorites(response => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  } else {
    moneyManager.setMessage(response.success, response.error);
  }
});

//добавление пользователя
favoritesWidget.addUserCallback = data => {
  ApiConnector.addUserToFavorites(data, response => {
    if (response.success) {
      favoritesWidget.setMessage(response.success, 'Пользователь успешно добавлен в список избранного!');
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  });
}

//удаление пользователя
favoritesWidget.removeUserCallback = data => {
  ApiConnector.removeUserFromFavorites(data, response => {
    if (response.success) {
      favoritesWidget.setMessage(response.success, 'Пользователь успешно удалён из списка избранного!');
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      favoritesWidget.setMessage(response.success, response.error);
    }
  });
}
