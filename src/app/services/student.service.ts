import { Injectable } from '@angular/core';
import { Student } from '../models/students.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  privateUrl = 'https://localhost:44344/api/Students';

  constructor(private http: HttpClient) { }
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.privateUrl);
  }
  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.privateUrl}/${id}`);
  }
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.privateUrl, student);
  }
  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.privateUrl}/${student.id}`, student);
  }
  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.privateUrl}/${id}`);
  }
}
