using System;
using Education_assistant.helpers.implements;

namespace Education_assistant.helpers;

public class DiemSoHelper : IDiemSoHelper
{
    public decimal ComparePoint(decimal diemTongKet1, decimal diemTongKet2)
    {
        return diemTongKet1 > diemTongKet2 ? diemTongKet1 : diemTongKet2;
    }
}
