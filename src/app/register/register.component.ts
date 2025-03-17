import { CommonModule } from '@angular/common';
import { Component, inject, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true
})
export class RegisterComponent implements OnInit {

  formularioRegister: FormGroup;
  authService = inject(AuthService);
  @Output() exportRegistered = new EventEmitter<boolean>();

  constructor(private form: FormBuilder){
    this.formularioRegister = this.form.group({
      username: ['', [Validators.required, Validators.minLength(8)]], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], 
      //age: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
    });
  }
ngOnInit(): void {
    this.formularioRegister = this.form.group({
      username: ['', [Validators.required, Validators.minLength(8)]], // Valor predeterminat pel nom d'usuari
      email: ['', [Validators.required, Validators.email]], // Valor predeterminat pel correu
      password: ['', [Validators.required, Validators.minLength(6)]], // Valor predeterminado para la contrasenya
      //age: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
  }
  hasError(controlName:string, errorType:string){
    return this.formularioRegister.get(controlName)?.hasError(errorType) && this.formularioRegister.get(controlName)?.touched;  
  }

  register(){
    if (this.formularioRegister.invalid) {
      this.formularioRegister.markAllAsTouched();
      return;
    }

    const registerData = this.formularioRegister.value;

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registre amb èxit:', response);
        this.exportRegistered.emit(true);
        alert('Registre amb èxit.');
      
      },
      error: (error) => {
        console.error('Error en el registre:', error);
        alert('Error en el registre, prova-ho de nou més tard.');
      }
    });
  }
}
