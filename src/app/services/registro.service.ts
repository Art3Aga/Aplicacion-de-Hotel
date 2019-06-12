import { Injectable } from '@angular/core';
import { AngularFirestore} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  usuarios:Observable<any[]>
  constructor(private afDB: AngularFireDatabase) { 
    this.usuarios = afDB.list('registro').valueChanges()
  }
}
