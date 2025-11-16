namespace BlogApp.EntityLayer.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? ImgUrl { get; set; }

        //Navigation property: Her bir blog foreign key ile bir kategoriye bağlı.
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
