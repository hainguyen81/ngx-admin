import { Observable } from 'rxjs';
import {User} from './user';

export abstract class UserData {
  abstract getUsers(): Observable<User[]>;
}
