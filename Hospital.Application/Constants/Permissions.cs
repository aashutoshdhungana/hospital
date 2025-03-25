using Hospital.Application.DTOs.Patient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Constants
{
    public static class Permissions
    {
        public const string CreatePatient = "c.patient";
        public const string CreateDoctor = "c.doctor";
        public const string CreateAppointment = "c.appointment";
    }
}
