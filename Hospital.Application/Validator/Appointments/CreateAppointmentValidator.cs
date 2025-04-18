using FluentValidation;
using Hospital.Application.DTOs.Appointment;

namespace Hospital.Application.Validator.Appointments
{
    public class CreateAppointmentValidator : AbstractValidator<CreateAppointmentDTO>
    {
        public CreateAppointmentValidator()
        {
            RuleFor(x => x.DoctorInfoId)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Doctor is required");

            RuleFor(x => x.PatientInfoId)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Patient is required");

            RuleFor(x => x.AppointmentDate);
                //.GreaterThanOrEqualTo(DateTime.UtcNow)
                //.WithMessage("Appointment date can not be in the past");
        }
    }
}
