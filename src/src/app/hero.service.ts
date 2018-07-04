import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'

import { Hero } from './hero';
import { Observable, of} from 'rxjs';
import { MessageService } from './message.service';

const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  constructor(
      private http: HttpClient,
      private messageService: MessageService
    ) { }

  private heroesUrl = 'api/heroes';

  

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      ); 
  }

  getHero(id: Number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      ); 
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero with id: ${hero.id}`)),
        catchError(this.handleError<Hero>(`updateHero`))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`added hero with id: ${hero.id}`)),
        catchError(this.handleError<Hero>(`addHero`))
      );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const heroUrl = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(heroUrl, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero with id: ${id}`)),
        catchError(this.handleError<Hero>(`deleteHero`))
      )
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      return of([])
    }

    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
      .pipe(
        tap(_ => this.log(`found heroes matchng ${term}`)),
        catchError(this.handleError<Hero[]>('search', []))
      )
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.status}: ${error.statusText}`);

      return of(result as T);
    }
  } 
}