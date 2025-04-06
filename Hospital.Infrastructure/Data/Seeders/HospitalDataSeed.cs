using Hospital.Application.Constants;
using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Aggregates.Patient;
using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Infrastructure.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;

namespace Hospital.Infrastructure.Data.Seeders
{
    public static class HospitalDataSeeder
    {
        public static async Task SeedData(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<ApplicationDbContext>();
            var userManager = services.GetRequiredService<UserManager<User>>();
            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

            // Apply pending migrations if any
            await context.Database.MigrateAsync();

            // Create roles if they don't exist
            await SeedRolesAndPermissionsAsync(roleManager);

            // Seed admin user
            var adminUser = await SeedAdminUser(userManager, context);

            var receptionist = await SeedReceptionistUser(userManager, context, adminUser.UserInfoId);
            // Seed doctors with specializations
            var doctors = await SeedDoctors(userManager, context, adminUser.UserInfoId);

            await SeedPharmacistUser(userManager, context, adminUser.UserInfoId);
            // Seed patients
            var patients = await SeedPatients(userManager, context, adminUser.UserInfoId);

            // Seed appointments
            await SeedAppointments(context, doctors, patients, adminUser.UserInfoId);

        }

        public static async Task SeedRolesAndPermissionsAsync(RoleManager<IdentityRole> roleManager)
        {
            // Define roles
            string[] roleNames = { "Admin", "Doctor", "Receptionist", "Pharmacist", "Patient" };

            // Create roles if they don't exist
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Assign permissions to Doctor role
            var doctorRole = await roleManager.FindByNameAsync("Doctor");
            await AddPermissionsToRole(roleManager, doctorRole, new[]
            {
                Permissions.ViewPatient,
                Permissions.ViewAppointment,
                Permissions.EditAppointment,
                Permissions.CreatePatientHistory,
                Permissions.ViewPatientHistory,
                Permissions.EditPatientHistory,
                Permissions.DeletePatientHistory,
                Permissions.CreateSkinAnalysis,
                Permissions.ViewSkinAnalysis,
                Permissions.EditSkinAnalysis,
                Permissions.DeleteSkinAnalysis,
                Permissions.CreateDiagnosis,
                Permissions.ViewDiagnosis,
                Permissions.EditDiagnosis,
                Permissions.DeleteDiagnosis,
                Permissions.CreateMedication,
                Permissions.ViewMedication,
                Permissions.EditMedication,
                Permissions.DeleteMedication,
                Permissions.ViewMedicine
            });

            // Assign permissions to Receptionist role
            var receptionistRole = await roleManager.FindByNameAsync("Receptionist");
            await AddPermissionsToRole(roleManager, receptionistRole, new[]
            {
                Permissions.CreatePatient,
                Permissions.ViewPatient,
                Permissions.EditPatient,
                Permissions.DeletePatient,
                Permissions.CreateAppointment,
                Permissions.ViewAppointment,
                Permissions.EditAppointment,
                Permissions.DeleteAppointment
            });

            // Assign permissions to Pharmacist role
            var pharmacistRole = await roleManager.FindByNameAsync("Pharmacist");
            await AddPermissionsToRole(roleManager, pharmacistRole, new[]
            {
                Permissions.ViewPatient,
                Permissions.ViewAppointment,
                Permissions.ViewMedication,
                Permissions.CreateMedicine,
                Permissions.ViewMedicine,
                Permissions.EditMedicine,
                Permissions.DeleteMedicine
            });
        }

        private static async Task AddPermissionsToRole(RoleManager<IdentityRole> roleManager, IdentityRole role, string[] permissions)
        {
            foreach (var permission in permissions)
            {
                await roleManager.AddClaimAsync(role, new Claim(ApplicationClaims.Permission, permission));
            }
        }

        private static async Task<User> SeedAdminUser(UserManager<User> userManager, ApplicationDbContext context)
        {
            const string adminEmail = "admin@hospital.com";
            const string adminPassword = "Admin@123456";

            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                // Create admin user info
                var adminAddress = new Address(
                    "123 Admin Street",
                    "Admin City",
                    "Admin State",
                    "USA"
                );

                var adminUserInfo = new UserInfo(
                    adminEmail,
                    "Hospital",
                    "",
                    "Admin",
                    "1234567890",
                    Gender.Male,
                    adminAddress,
                    DateTime.SpecifyKind(new DateTime(1980, 1, 1), DateTimeKind.Utc),
                    1 // System ID for created by
                );

                context.UserInfos.Add(adminUserInfo);
                await context.SaveChangesAsync();

                // Create admin Identity user
                adminUser = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    PhoneNumber = "1234567890",
                    IsPhoneNumberConfirmed = true,
                    UserInfo = adminUserInfo
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");

                    // Link user info
                    adminUser.AddUserInfo(adminUserInfo);
                    adminUser.UserInfoId = adminUserInfo.Id;
                    await context.SaveChangesAsync();
                }
            }
            return adminUser;
        }

        private static async Task<User> SeedReceptionistUser(UserManager<User> userManager, ApplicationDbContext context, int createdBy)
        {
            const string receptionistEmail = "receptionist@hospital.com";
            const string password = "Receptionist@123456";

            var user = await userManager.FindByEmailAsync(receptionistEmail);

            if (user == null)
            {
                // Create admin user info
                var address = new Address(
                    "123 Reception Street",
                    "Reception City",
                    "Reception State",
                    "USA"
                );

                var userInfo = new UserInfo(
                    receptionistEmail,
                    "Hospital",
                    "",
                    "Receptionist",
                    "1234567891",
                    Gender.Male,
                    address,
                    DateTime.SpecifyKind(new DateTime(1980, 1, 1), DateTimeKind.Utc),
                    createdBy // System ID for created by
                );

                context.UserInfos.Add(userInfo);
                await context.SaveChangesAsync();

                // Create admin Identity user
                user = new User
                {
                    UserName = receptionistEmail,
                    Email = receptionistEmail,
                    EmailConfirmed = true,
                    PhoneNumber = "1234567891",
                    IsPhoneNumberConfirmed = true,
                    UserInfo = userInfo
                };

                var result = await userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Receptionist");

                    // Link user info
                    user.AddUserInfo(userInfo);
                    user.UserInfoId = userInfo.Id;
                    await context.SaveChangesAsync();
                }
            }
            return user;
        }

        private static async Task<User> SeedPharmacistUser(UserManager<User> userManager, ApplicationDbContext context, int createdBy)
        {
            const string pharmacistEmail = "pharmacist@hospital.com";
            const string password = "Pharmacist@123456";
            var user = await userManager.FindByEmailAsync(pharmacistEmail);
            if (user == null)
            {
                // Create pharmacist user info
                var address = new Address(
                    "456 Pharmacy Avenue",
                    "Pharmacy City",
                    "Pharmacy State",
                    "USA"
                );
                var userInfo = new UserInfo(
                    pharmacistEmail,
                    "Hospital",
                    "",
                    "Pharmacist",
                    "9876543210",
                    Gender.Female,
                    address,
                    DateTime.SpecifyKind(new DateTime(1985, 5, 15), DateTimeKind.Utc),
                    createdBy // System ID for created by
                );
                context.UserInfos.Add(userInfo);
                await context.SaveChangesAsync();
                // Create pharmacist Identity user
                user = new User
                {
                    UserName = pharmacistEmail,
                    Email = pharmacistEmail,
                    EmailConfirmed = true,
                    PhoneNumber = "9876543210",
                    IsPhoneNumberConfirmed = true,
                    UserInfo = userInfo
                };
                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Pharmacist");
                    // Link user info
                    user.AddUserInfo(userInfo);
                    user.UserInfoId = userInfo.Id;
                    await context.SaveChangesAsync();
                }
            }
            return user;
        }
        private static async Task<List<DoctorInfo>> SeedDoctors(UserManager<User> userManager, ApplicationDbContext context, int createdById)
        {
            var doctors = new List<DoctorInfo>();

            // Doctor 1 - Cardiologist
            var doctor1Email = "john.smith@hospital.com";
            var doctor1User = await userManager.FindByEmailAsync(doctor1Email);

            if (doctor1User == null)
            {
                var doctor1Address = new Address(
                    "456 Medical Avenue",
                    "Boston",
                    "Massachusetts",
                    "USA"
                );

                var doctor1UserInfo = new UserInfo(
                    doctor1Email,
                    "John",
                    "A",
                    "Smith",
                    "2345678901",
                    Gender.Male,
                    doctor1Address,
                    DateTime.SpecifyKind(new DateTime(1975, 5, 15), DateTimeKind.Utc),
                    createdById
                );

                context.UserInfos.Add(doctor1UserInfo);
                await context.SaveChangesAsync();

                // Create doctor entity
                var doctor1 = new DoctorInfo(
                    doctor1UserInfo,
                    Specialization.Cardiologist,
                    createdById
                );

                context.DoctorInfos.Add(doctor1);
                await context.SaveChangesAsync();
                doctors.Add(doctor1);

                // Create Identity user for doctor
                doctor1User = new User
                {
                    UserName = doctor1Email,
                    Email = doctor1Email,
                    EmailConfirmed = true,
                    PhoneNumber = "2345678901",
                    IsPhoneNumberConfirmed = true,
                    UserInfoId = doctor1UserInfo.Id
                };

                var result = await userManager.CreateAsync(doctor1User, "Doctor@123456");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(doctor1User, "Doctor");
                }
            }

            // Doctor 2 - Neurologist
            var doctor2Email = "sarah.johnson@hospital.com";
            var doctor2User = await userManager.FindByEmailAsync(doctor2Email);

            if (doctor2User == null)
            {
                var doctor2Address = new Address(
                    "789 Health Street",
                    "New York",
                    "New York",
                    "USA"
                );

                var doctor2UserInfo = new UserInfo(
                    doctor2Email,
                    "Sarah",
                    "B",
                    "Johnson",
                    "3456789012",
                    Gender.Female,
                    doctor2Address,
                    DateTime.SpecifyKind(new DateTime(1980, 8, 20), DateTimeKind.Utc),
                    createdById
                );

                context.UserInfos.Add(doctor2UserInfo);
                await context.SaveChangesAsync();

                // Create doctor entity
                var doctor2 = new DoctorInfo(
                    doctor2UserInfo,
                    Specialization.Neurologist,
                    createdById
                );

                context.DoctorInfos.Add(doctor2);
                await context.SaveChangesAsync();
                doctors.Add(doctor2);

                // Create Identity user for doctor
                doctor2User = new User
                {
                    UserName = doctor2Email,
                    Email = doctor2Email,
                    EmailConfirmed = true,
                    PhoneNumber = "3456789012",
                    IsPhoneNumberConfirmed = true,
                    UserInfoId = doctor2UserInfo.Id
                };

                var result = await userManager.CreateAsync(doctor2User, "Doctor@123456");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(doctor2User, "Doctor");
                }
            }

            return doctors;
        }

        private static async Task<List<PatientInfo>> SeedPatients(UserManager<User> userManager, ApplicationDbContext context, int createdById)
        {
            var patients = new List<PatientInfo>();

            // Patient 1
            var patient1Email = "michael.brown@example.com";
            var patient1User = await userManager.FindByEmailAsync(patient1Email);

            if (patient1User == null)
            {
                var patient1Address = new Address(
                    "123 Patient Lane",
                    "Chicago",
                    "Illinois",
                    "USA"
                );

                var patient1UserInfo = new UserInfo(
                    patient1Email,
                    "Michael",
                    "C",
                    "Brown",
                    "4567890123",
                    Gender.Male,
                    patient1Address,
                    DateTime.SpecifyKind(new DateTime(1990, 3, 10), DateTimeKind.Utc),
                    createdById
                );

                context.UserInfos.Add(patient1UserInfo);
                await context.SaveChangesAsync();

                // Create patient info
                var patient1 = new PatientInfo(
                    patient1UserInfo,
                    "Jennifer Brown",
                    "5678901234",
                    createdById
                );

                context.PatientInfos.Add(patient1);
                await context.SaveChangesAsync();
                patients.Add(patient1);

                // Create Identity user for patient
                patient1User = new User
                {
                    UserName = patient1Email,
                    Email = patient1Email,
                    EmailConfirmed = true,
                    PhoneNumber = "4567890123",
                    IsPhoneNumberConfirmed = true,
                    UserInfoId = patient1UserInfo.Id
                };

                var result = await userManager.CreateAsync(patient1User, "Patient@123456");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(patient1User, "Patient");
                }
            }

            // Patient 2
            var patient2Email = "emily.davis@example.com";
            var patient2User = await userManager.FindByEmailAsync(patient2Email);

            if (patient2User == null)
            {
                var patient2Address = new Address(
                    "456 Patient Avenue",
                    "Los Angeles",
                    "California",
                    "USA"
                );

                var patient2UserInfo = new UserInfo(
                    patient2Email,
                    "Emily",
                    "D",
                    "Davis",
                    "5678901234",
                    Gender.Female,
                    patient2Address,
                    DateTime.SpecifyKind(new DateTime(1985, 7, 25), DateTimeKind.Utc),
                    createdById
                );

                context.UserInfos.Add(patient2UserInfo);
                await context.SaveChangesAsync();

                // Create patient info
                var patient2 = new PatientInfo(
                    patient2UserInfo,
                    "Robert Davis",
                    "6789012345",
                    createdById
                );

                context.PatientInfos.Add(patient2);
                await context.SaveChangesAsync();
                patients.Add(patient2);

                // Create Identity user for patient
                patient2User = new User
                {
                    UserName = patient2Email,
                    Email = patient2Email,
                    EmailConfirmed = true,
                    PhoneNumber = "5678901234",
                    IsPhoneNumberConfirmed = true,
                    UserInfoId = patient2UserInfo.Id
                };

                var result = await userManager.CreateAsync(patient2User, "Patient@123456");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(patient2User, "Patient");
                }
            }
            return patients;
        }

        private static async Task SeedAppointments(ApplicationDbContext context, List<DoctorInfo> doctors, List<PatientInfo> patients, int createdById)
        {
            // Assuming you have an Appointment class, if not you'll need to create it
            // Here's a basic implementation:
            if (!context.AppointmentInfos.Any())
            {
                // Appointment 1 - Future appointment
                var appointment1 = new AppointmentInfo(
                    doctors[0].Id, // Cardiologist
                    patients[0].PatientId, // Michael Brown
                    DateTime.UtcNow.AddDays(7).Date.AddHours(10), // 10 AM next week
                    createdById
                );

                // Appointment 2 - Today's appointment
                var appointment2 = new AppointmentInfo(
                    doctors[1].Id, // Neurologist
                    patients[1].PatientId, // Emily Davis
                    DateTime.UtcNow.Date.AddHours(14), // 2 PM today
                    createdById
                );

                context.AppointmentInfos.AddRange(appointment1, appointment2);
                await context.SaveChangesAsync();
            }
        }
    }
}