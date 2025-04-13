namespace Hospital.Application.Models
{
    public class PaginationParams
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;

        public const int MaxPageSzie = 50;

        public void Validate()
        {
            if (PageSize > MaxPageSzie)
                PageSize = MaxPageSzie;

            if (PageNumber <= 0)
                PageNumber = 1;
        }
    }
}
