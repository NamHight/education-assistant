namespace Education_assistant.Exceptions.ThrowError.PhongHocExceptions
{
    public class PhongHocNotFoundException : NotFoundException
    {
        public PhongHocNotFoundException(Guid id) : base($"Trường với {id} không tìm thấy!")
        {
        }
    }
}
