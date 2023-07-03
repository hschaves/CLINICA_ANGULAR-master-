import { Component, OnInit } from '@angular/core';
import { Doctor } from '../models/doctor';
import { DoctorsService } from '../services/doctors.service';
import { Especialidad } from '../models/specialties';
import { SpecialtiesService } from '../services/specialties.service';

@Component({
  selector: 'app-doctores',
  templateUrl: './doctores.component.html',
  styleUrls: ['./doctores.component.scss']
})

export class DoctoresComponent implements OnInit {
  doctor: Doctor = {
    id: '',
    nombre: '',
    apellidos: '',
    dni: '',
    nColegiado: '',
    especialidad: '',
    telefono: '',
    correoElectronico: '',
    horario: this.generarHorario(this.horaInicio, this.horaFinal),
    //citas: ''
  };

  //PARA AUTHENTICATION
  rol: any;

  mensaje: string = '';
  mensajeBusq: string = '';

  horaInicio?: number;
  horaFinal?: number;
  doctorsEncontrados: Doctor[] = [];
  doctorsEncontradosDNI: Doctor[] = [];
  doctorSeleccionado: Doctor | null = null;

  specialtyBuscar: string = '';
  dniBuscar: string = '';

  especialidades: Especialidad[] = [];

  constructor(private doctorsService: DoctorsService, private specialtiesService: SpecialtiesService) {
    this.loadDoctorsBySpecialty();


  }

  ngOnInit() {
    this.loadSpecialties();
    this.rol = localStorage.getItem('ROL');
  }

  //PARA AUTHENTICATION
  isAuthenticated(rol:string){
    return this.rol == rol;
  }

  agregarDoctor() {
    if (!this.camposValidos()) {
      this.mensaje = 'Por favor, complete todos os campos.';
      return;
    }

    this.doctorsService.getDoctorPorDni(this.doctor.dni)
      .then((exists) => {
        if (exists) {
          this.mensaje = 'Já existe um doutor com esse DNI.';
        } else {
          this.doctorsService.addDoctor(this.doctor)
            .then(() => {
              this.mensaje = 'Doutor agregado com sucesso.';
              this.limpiarFormulario();
            })
            .catch((error: any) => {
              this.mensaje = 'Erro ao agregar doutor: ' + error;
            });
        }
      })
      .catch((error: any) => {
        this.mensaje = 'Erro ao verificar a existencia do doutor: ' + error;
      });
  }

  buscarDoctorPorEspecialidad(especialidad: string) {
    this.doctorsService.buscarDoctorPorEspecialidad(especialidad)
      .then((doctors) => {
        this.doctorsEncontrados = doctors;
        if (doctors.length === 0) {
          this.mensajeBusq = 'Não foram encontrados doutores com esta especialidade.';
          this.limpiarFormulario();
        } else {
          this.mensajeBusq = '';
        }
      })
      .catch((error) => {
        this.mensajeBusq = 'Erro ao buscar o doutor: ' + error;
        this.doctorsEncontrados = [];
      });
  }

  buscarDoctorPorDNI(dni: string) {
    this.doctorsService.buscarDoctorPorDNI(dni)
    .then((doctors) => {
    this.doctorsEncontrados = doctors;
    if (doctors.length === 0) {
    this.mensajeBusq = 'Não foram encontrados doutores com esse DNI';
    } else {
    this.mensajeBusq = '';
    }
    })
    .catch((error) => {
    this.mensajeBusq = 'Erro ao buscar doutor: ' + error;
    this.doctorsEncontradosDNI = [];
    });
    }


  seleccionarDoctor(doctor: Doctor) {
    this.doctorSeleccionado = { ...doctor };
  }

  modificarDoctor() {
    if (this.doctorSeleccionado) {
      this.doctorsService.modificarDoctor(this.doctorSeleccionado)
        .then(() => {
          this.mensaje = 'Doutor modificado corretamente.';
          this.doctorSeleccionado = null;
          this.buscarDoctorPorEspecialidad(this.specialtyBuscar);
        })
        .catch((error) => {
          this.mensaje = 'Erro ao modificar o doutor: ' + error;
        });
    }
  }

  borrarDoctor(id: string) {
    this.doctorsService.borrarDoctor(id)
      .then(() => {
        this.mensaje = 'Doutor eliminado corretamente.';
        this.doctorsEncontrados = this.doctorsEncontrados.filter(doctor => doctor.id !== id);
      })
      .catch((error) => {
        this.mensaje = 'Erro ao eliminar o doutor: ' + error;
      });
  }

  camposValidos() {
    return (
      this.doctor.dni &&
      this.doctor.nombre &&
      this.doctor.especialidad
    );
  }

  limpiarFormulario() {
    this.doctor = {
      id: '',
      nombre: '',
      apellidos: '',
      dni: '',
      nColegiado: '',
      especialidad: '',
      telefono: '',
      correoElectronico: '',
      horario: this.generarHorario(),
    };
  }

  loadDoctorsBySpecialty() {
    const especialidadSeleccionada = this.specialtyBuscar;
    if (especialidadSeleccionada) {
      this.doctorsService.buscarDoctorPorEspecialidad(especialidadSeleccionada)
        .then((doctors) => {
          this.doctorsEncontrados = doctors;
          if (doctors.length === 0) {
            this.mensaje = 'Não foram encontrados doutores com esta especialidade.';
          } else {
            this.mensaje = '';
          }
        })
        .catch((error) => {
          this.mensaje = 'Erro ao buscar o doutor: ' + error;
          this.doctorsEncontrados = [];
        });
    } else {
      this.doctorsEncontrados = [];
      this.mensaje = '';
    }
  }

  generarHorario(horaIni?: number, horaFin?: number) {
    const horario = [];
    const horaInicio = new Date().setHours(horaIni? horaIni: 8, 0, 0); 
    const horaFinal = new Date().setHours(horaFin? horaFin: 15, 0, 0); 

    const tiempoIncremento = 30; 

    let horaActual = horaInicio;
    while (horaActual <= horaFinal) {
      const hora = new Date(horaActual);
      const horaFormateada = this.formatoHora(hora);
      horario.push(horaFormateada);

      horaActual += tiempoIncremento * 60 * 1000; 
    }

    return horario;
  }

  formatoHora(hora: Date) {
    const opciones = { hour: 'numeric', minute: 'numeric' } as const;
    return hora.toLocaleTimeString([], opciones);
  }

  loadSpecialties(){
    this.specialtiesService.getAllSpecialties().then((listSpecialties) => {
      this.especialidades = listSpecialties;
    });
  }



}
