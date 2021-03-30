import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private servicioUrl = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'KRXjSZxGLOoMhCEVDnxDDpe3kabX67Xj';
  private _historial: string[] = [];
  public resultados: Gif[] = [];


  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }

   this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [] ;
  }

  buscarGifs(query: string =''): void{
    // quitar espacios adelante y atras para evitar errores y pasarlo a minúsculas
    query = query.trim().toLocaleLowerCase();
    // si no existe el query entonces lo agrega al arreglo 
    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      // cortar el arreglo a solo 10
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
      console.log(this._historial);

      
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', query);

    console.log(params.toString());


    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params}).subscribe((resp) =>{ 
      console.log(resp.data);
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
  });
      
  }

        
  

}



// llamar un endpoint con fetch
// fetch('https://api.giphy.com/v1/gifs/search?api_key=KRXjSZxGLOoMhCEVDnxDDpe3kabX67Xj&q=dragon ball z&limit=10').then(resp =>{resp.json().then(data => console.log(data))});
