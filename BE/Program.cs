using DotNetEnv;
using Education_assistant.Extensions;
using NLog;

var builder = WebApplication.CreateBuilder(args);
Env.Load();
builder.Configuration.AddEnvironmentVariables();
LogManager.LoadConfiguration(string.Concat(Directory.GetCurrentDirectory(), "/nlog.config"));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddCorsService(builder.Configuration)
    .AddIISIntegration()
    .AddDependence()
    .AddInfrastructure(builder.Configuration)
    .AddPresentation();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
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