FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build                                                                                     Dockerfile                                                                                                 FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . ./

ARG PROJECT_NAME=Education-assistant

RUN dotnet restore "$PROJECT_NAME.csproj"

RUN dotnet publish "$PROJECT_NAME.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
COPY --from=build /app/publish .
COPY ./appsettings.json ./appsettings.json
ENV ASPNETCORE_URLS=http://+:90
EXPOSE 90
ENTRYPOINT ["dotnet", "Education-assistant.dll"]
