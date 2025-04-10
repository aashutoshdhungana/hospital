using Hospital.Application.DTOs.Appointment;
using Hospital.Application.DTOs.Doctor;
using Hospital.Application.DTOs.Patient;
using Hospital.Application.DTOs.UserInfo;
using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Aggregates.Patient;
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
                .Map(dest => dest.Gender, src => src.Gender);

            TypeAdapterConfig<AppointmentInfo, AppointmentDTO>
                .NewConfig()
                .Map(dest => dest.DoctorId, src => src.DoctorInfoId)
                .Map(dest => dest.PatientId, src => src.PatientInfoId)
                .Map(dest => dest.DoctorName, src => $"Dr. {src.DoctorInfo.UserInfo.FirstName} {src.DoctorInfo.UserInfo.LastName}")
                .Map(dest => dest.PatientName, src => $"{src.PatientInfo.UserInfo.FirstName} {src.PatientInfo.UserInfo.LastName}");

            TypeAdapterConfig<PatientInfo, PatientInfoDTO>
                .NewConfig()
                .Map(dest => dest.FirstName, src => src.UserInfo.FirstName)
                .Map(dest => dest.MiddleName, src => src.UserInfo.MiddleName)
                .Map(dest => dest.LastName, src => src.UserInfo.LastName)
                .Map(dest => dest.PhoneNumber, src => src.UserInfo.PhoneNumber)
                .Map(dest => dest.Gender, src => src.UserInfo.Gender)
                .Map(dest => dest.Email, src => src.UserInfo.Email)
                .Map(dest => dest.DateOfBirth, src => src.UserInfo.DateOfBirth)
                .Map(dest => dest.Street, src => src.UserInfo.Address.Street)
                .Map(dest => dest.City, src => src.UserInfo.Address.City)
                .Map(dest => dest.State, src => src.UserInfo.Address.State)
                .Map(dest => dest.Country, src => src.UserInfo.Address.Country);

            TypeAdapterConfig<DoctorInfo, ViewDoctorDTO>
                .NewConfig()
                .Map(dest => dest.FirstName, src => src.UserInfo.FirstName)
                .Map(dest => dest.MiddleName, src => src.UserInfo.MiddleName)
                .Map(dest => dest.LastName, src => src.UserInfo.LastName)
                .Map(dest => dest.PhoneNumber, src => src.UserInfo.PhoneNumber)
                .Map(dest => dest.Gender, src => src.UserInfo.Gender)
                .Map(dest => dest.Email, src => src.UserInfo.Email)
                .Map(dest => dest.DateOfBirth, src => src.UserInfo.DateOfBirth)
                .Map(dest => dest.Street, src => src.UserInfo.Address.Street)
                .Map(dest => dest.City, src => src.UserInfo.Address.City)
                .Map(dest => dest.State, src => src.UserInfo.Address.State)
                .Map(dest => dest.Country, src => src.UserInfo.Address.Country);
        }
    }
}
