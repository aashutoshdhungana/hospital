namespace Hospital.Domain.BaseEntities
{
    public class Entity<IdType> : SoftDeletable
    {
        protected Entity() { }
        public IdType Id { get; private set; }
        protected Entity(IdType id)
        {
            Id = id;
        }
    }
}
