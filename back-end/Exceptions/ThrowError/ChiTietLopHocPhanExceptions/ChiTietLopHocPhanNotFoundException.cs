using System;

namespace Education_assistant.Exceptions.ThrowError.ChiTietLopHocPhanExceptions;

public class ChiTietLopHocPhanNotFoundException : NotFoundException
{
    public ChiTietLopHocPhanNotFoundException(Guid id) : base($"Chi tiết lớp học phần với id: {id} khong tìm thấy!")
    {
    }
}
