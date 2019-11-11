import { Injectable } from '@angular/core';
import { SmartTableData } from '../data/smart-table';

@Injectable()
export class SmartTableService extends SmartTableData {

  data = [{
    id: 1,
    firstName: '1',
    lastName: '0',
    username: '0',
    email: '1',
    age: '0',
  }, {
    id: 2,
    firstName: '2',
    lastName: '0',
    username: '0',
    email: '0',
    age: '1',
  }, {
    id: 3,
    firstName: '3',
    lastName: '1',
    username: '0',
    email: '0',
    age: '0',
  }, {
    id: 4,
    firstName: '4',
    lastName: '0',
    username: '0',
    email: '0',
    age: '0',
  },
    {
    'id': 5,
    'firstName': '5',
    'lastName': '1',
    'username': '1',
    'email': '1',
    'age': 1,
  }];

  getData() {
    return this.data;
  }
}
