using ListList.Api.Data;
using ListList.Api.Endpoints;
using MongoDB.Driver;
using MongoDB.Bson;
using ListList.Api.Entities;
using ListList.Api.Mapping;

ListListEntitySerializer.RegisterBsonClassMap();

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration["MONGODB_URI"];
var client = new MongoClient(connString);
var collection = client.GetDatabase("listlist").GetCollection<ListListEntity>("lists");

// var filter = Builders<ListListEntity>.Filter.Eq(list => list.Title, "anime list");
// var update = Builders<ListListEntity>.Update.Push(list => list.Items,
//     new()
//     {
//         Name = "5-toubun no hanayome",
//         Groups = [0, 2, 13, 15, 20],
//         GroupPositions = new Dictionary<string, int>() { { "0", 1 }, { "2", 97 }, { "13", 0 }, { "15", 0 }, { "20", 1 } },
//         Properties = { new() { Name = "last watched", Data = "11/28/2023" }, new() { Name = "japanese title", Data = "五等分の花嫁" }, new() { Name = "english title", Data = "the quintessential quintuplets" }, new() { Name = "notes", Data = "" } }
//     }
// );

// collection.UpdateOne(filter, update);

var filter = Builders<ListListEntity>.Filter.Eq(list => list.Title, "anime list");
var list = await collection.Find(filter).FirstOrDefaultAsync();

var app = builder.Build();

// app.MapListEndpoints();

app.MapGet("/", () => list.ToListListDto());


app.Run();
