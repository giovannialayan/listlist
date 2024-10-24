namespace ListList.Api.Dtos;

public record class UpdateListDto(
    string Title,
    List<string> Properties
);