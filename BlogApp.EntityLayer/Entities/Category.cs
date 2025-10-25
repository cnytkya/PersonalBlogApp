namespace BlogApp.EntityLayer.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        // Navigation property: Bir kategorinin birden fazla blogu olabilir
        public List<Blog> Blogs { get; set; } = new List<Blog>();
    }
}
