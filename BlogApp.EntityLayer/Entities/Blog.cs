namespace BlogApp.EntityLayer.Entities
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string? ImgUrl { get; set; }
        // Asıl blog yazısı içeriği
        public string Content { get; set; } = string.Empty;

        //Navigation property: Her bir blog foreign key ile bir kategoriye bağlı.
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
