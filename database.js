import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    menuItems.forEach((item) => {
        tx.executeSql(
            'insert into menuitems (id, title, price, category) VALUES (?, ?, ?, ?)',
             [item.id, item.title, item.price, item.category],
    )});
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    let req = 'select * from menuitems';
    if (query.length > 0 || activeCategories.length > 0) {
        req = req + ' where'
        if (query.length > 0) {
            req = req + ` title like "%${query}%"`
                if (activeCategories.length > 0) {
                    req = req + ' and'
                }
        }
        if (activeCategories.length > 0) {
            req = req + ` category in (${activeCategories.map(( item ) => {
                return `'${ item }'`
            })})`
        }
    }
    db.transaction((tx) => {
        tx.executeSql(req, [], (_, {rows}) => {
            resolve(rows._array);
        });
    })
  });
}
