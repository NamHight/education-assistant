FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ./back-end/Education-assistant.csproj ./back-end/
RUN dotnet restore "back-end/Education-assistant.csproj"
COPY ./back-end/. ./back-end/
WORKDIR "/src/back-end"
RUN dotnet build "Education-assistant.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Education-assistant.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "Education-assistant.dll" ]
