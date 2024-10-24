using ListList.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("ListlistDb");
builder.Services.AddSqlite<ListListContext>(connString);

var app = builder.Build();



await app.MigrateDbAsync();

app.Run();
