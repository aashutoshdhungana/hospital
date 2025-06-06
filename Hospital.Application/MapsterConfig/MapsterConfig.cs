﻿using Hospital.Application.DTOs.Appointment;
using Hospital.Application.DTOs.AppointmentDiagnosis;
using Hospital.Application.DTOs.Diagnosis;
using Hospital.Application.DTOs.Doctor;
using Hospital.Application.DTOs.Patient;
using Hospital.Application.DTOs.RxInfo;
using Hospital.Application.DTOs.UserInfo;
using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Aggregates.Diagnosis;
using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Aggregates.Rx;
using Hospital.Domain.Aggregates.UserInfo;
using Mapster;

namespace Hospital.Application.MapsterConfig
{
    public class MapsterConfig
    {
        public static void Configure()
        {
            TypeAdapterConfig<UserInfo, UserInfoDTO>
                .NewConfig()
                .Map(dest => dest.Street, src => src.Address.Street)
                .Map(dest => dest.City, src => src.Address.City)
                .Map(dest => dest.State, src => src.Address.State)
                .Map(dest => dest.Country, src => src.Address.Country)
                .Map(dest => dest.Gender, src => src.Gender)
                .Map(dest => dest.CreatedBy, src => src.CreatedByUser != null ? src.CreatedByUser.FullName : "")
                .Map(dest => dest.UpdatedBy, src => src.UpdatedByUser != null ? src.UpdatedByUser.FullName : "");

            TypeAdapterConfig<PatientInfoDTO, PatientInfoDTO>
                .NewConfig()
                .Map(dest => dest.UserInfo, src => src.UserInfo);

            TypeAdapterConfig<DoctorInfo, ViewDoctorDTO>
                .NewConfig()
                .Map(dest => dest.UserInfo, src => src.UserInfo);


            TypeAdapterConfig<RxInfo, RxInfoDTO>
                .NewConfig()
                .Map(dest => dest.CreatedBy, src => src.CreatedByUser != null ? src.CreatedByUser.FullName : "")
                .Map(dest => dest.UpdatedBy, src => src.UpdatedByUser != null ? src.UpdatedByUser.FullName : "")
                .Map(dest => dest.Diagnosis, src => src.Diagnosis != null ? src.Diagnosis.Code : ""); ;

            TypeAdapterConfig<AppointmentInfo, AppointmentDTO>
                .NewConfig()
                .Map(dest => dest.DoctorId, src => src.DoctorInfoId)
                .Map(dest => dest.PatientId, src => src.PatientInfoId)
                .Map(dest => dest.DoctorName, src => $"Dr. {src.DoctorInfo.UserInfo.FirstName} {src.DoctorInfo.UserInfo.LastName}")
                .Map(dest => dest.PatientName, src => $"{src.PatientInfo.UserInfo.FirstName} {src.PatientInfo.UserInfo.LastName}");
                

            TypeAdapterConfig<DiagnosisInfo, DiagnosisViewModel>
                .NewConfig()
                .Map(dest => dest.Prescriptions, src => src.Prescriptions)
                .Map(dest => dest.CreatedBy, src => src.CreatedByUser != null ? src.CreatedByUser.FullName : "")
                .Map(dest => dest.UpdatedBy, src => src.UpdatedByUser != null ? src.UpdatedByUser.FullName : "");

            TypeAdapterConfig<AppointmentDiagnosis, AppointmentDiagnosisDTO>
                .NewConfig()
                .Map(dest => dest.DiagnosisText, src => src.DiagnosisInfo != null ? src.DiagnosisInfo.DiagnosisText : "")
                .Map(dest => dest.Code, src => src.DiagnosisInfo != null ? src.DiagnosisInfo.Code : "");
        }
    }
}
