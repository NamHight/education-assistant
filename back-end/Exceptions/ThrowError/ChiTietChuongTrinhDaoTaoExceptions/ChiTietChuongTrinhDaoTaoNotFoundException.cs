namespace Education_assistant.Exceptions.ThrowError.ChiTietChuongTrinhDaoTaoExceptions;

public class ChiTietChuongTrinhDaoTaoNotFoundException : NotFoundException
{
    public ChiTietChuongTrinhDaoTaoNotFoundException() : base("Chi tiết chương trình đào tạo với không tìm thấy.")
    {
    }
}