using DotNetEnv;
using Education_assistant.Contracts.LoggerServices;
using Education_assistant.Extensions;
using Education_assistant.Mappers;
using NLog;

var builder = WebApplication.CreateBuilder(args);

Env.Load();
builder.Configuration.AddEnvironmentVariables();

builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", false, true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true, true)
    .AddEnvironmentVariables();

LogManager.LoadConfiguration(string.Concat(Directory.GetCurrentDirectory(), "/nlog.config"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services
    .AddEnv(builder.Configuration)
    .AddCorsService(builder.Configuration)
    .AddIISIntegration()
    .AddDependence()
    .AddInfrastructure(builder.Configuration)
    .AddPresentation();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var app = builder.Build();
var logger = app.Services.GetRequiredService<ILoggerService>();
app.ConfigureExceptionHandler(logger);
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // app.UseDeveloperExceptionPage();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseForwardedHeaders();
if (app.Environment.IsDevelopment())
    app.UseCors("DevelopmentPolicy");
else
    app.UseCors("ProductionPolicy");

app.UseAuthorization();
app.MapControllers();

app.Run();