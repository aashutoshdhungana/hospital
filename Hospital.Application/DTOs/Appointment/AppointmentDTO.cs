﻿using Hospital.Application.DTOs.MedicalAssesment;

namespace Hospital.Application.DTOs.Appointment
{
    public class AppointmentDTO
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; }
        public MedicalAssesmentDTO MedicalAssesment { get; set; }
    }
}
