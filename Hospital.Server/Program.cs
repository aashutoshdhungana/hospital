
using FluentValidation;
using Hospital.Application.DTOs.UserInfo;
using Hospital.Application.Interfaces;
using Hospital.Application.MapsterConfig;
using Hospital.Application.Services;
using Hospital.Domain.Aggregates.Appointment;
using Hospital.Domain.Aggregates.Doctor;
using Hospital.Domain.Aggregates.Patient;
using Hospital.Domain.Aggregates.UserInfo;
using Hospital.Infrastructure.Data;
using Hospital.Infrastructure.Data.Seeders;
using Hospital.Infrastructure.Identity.Models;
using Hospital.Infrastructure.Repositories;
using Hospital.Infrastructure.Services;
using Hospital.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("HospitalDb");
            builder.Services.AddDbContext<ApplicationDbContext>(
                option => option.UseNpgsql(connectionString));

            builder.Services.AddIdentityCore<User>()
                .AddRoles<IdentityRole>()
                .AddUserManager<UserManager<User>>()
                .AddRoleManager<RoleManager<IdentityRole>>()
                .AddSignInManager<SignInManager<User>>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            }).AddCookie(options =>
            {
                options.Cookie.Name = "Hospital.Auth";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Lax;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.ExpireTimeSpan = TimeSpan.FromHours(24);
                options.SlidingExpiration = true;
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                };
                options.Events.OnRedirectToAccessDenied = context =>
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                };
            });

            builder.Services.AddAuthorization();
            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            builder.Services.AddCors(x =>
            {
                x.AddPolicy("AllowFrontend", options =>
                {
                    options.AllowAnyMethod();
                    options.AllowAnyHeader();
                    options.WithOrigins("https://localhost:58493");
                    options.AllowCredentials();
                });
            });
            AddServicesToDI(builder);
            MapsterConfig.Configure();

            var app = builder.Build();

            app.UseStaticFiles();
            app.UseDefaultFiles();
            app.MapStaticAssets();
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                await HospitalDataSeeder.SeedData(app.Services);
                app.UseCors("AllowFrontend");
                app.MapOpenApi();
                app.UseSwaggerUI(opt =>
                {
                    opt.SwaggerEndpoint("/openapi/v1.json", "Hospital API V1");
                });
            }

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }

        public static WebApplicationBuilder AddServicesToDI(WebApplicationBuilder builder)
        {
            builder.Services.AddValidatorsFromAssemblyContaining<CreateUpdateUserInfoDTO>();
            builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
            builder.Services.AddScoped<IUserInfoService, UserInfoService>();
            builder.Services.AddScoped<IUserInfoRepository, UserInfoRepository>();
            builder.Services.AddScoped<IUserIdentityService, UserIdentityService>();
            builder.Services.AddScoped<IPatientRepository, PatientRepository>();
            builder.Services.AddScoped<ISMSService, SMSService>();
            builder.Services.AddScoped<IPatientService, PatientService>();
            builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
            builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();
            builder.Services.AddHttpContextAccessor();
            return builder;
        }
    }
}
