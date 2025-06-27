using System;
using System.ComponentModel.DataAnnotations;

namespace Education_assistant.Modules.ModuleTuan.DTOs.Request;

public class RequestAddTuanDto
{
    [Required(ErrorMessage = "Tuần không được để trống")]
    [Range(1, 52, ErrorMessage = "Số tuần phải lớn hơn 0")]
    public int SoTuan { get; set; }
    [Required(ErrorMessage = "Năm học không được để trống")]
    [Range(1900, int.MaxValue, ErrorMessage = "Số tuần phải lớn hơn 1900")]
    public int NamHoc { get; set; }
    [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
    public DateTime? NgayBatDau { get; set; }
}
public class RequestUpdateTuanDto
{
    [Required(ErrorMessage = "ID Tuần không được để trống")]
    public Guid Id { get; set; }
    [Required(ErrorMessage = "Tuần không được để trống")]
    [Range(1, 52, ErrorMessage = "Số tuần phải lớn hơn 0")]
    public int SoTuan { get; set; }
    [Required(ErrorMessage = "Năm học không được để trống")]
    [Range(1900, int.MaxValue, ErrorMessage = "Số tuần phải lớn hơn 1900")]
    public int NamHoc { get; set; }
    [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
    public DateTime? NgayBatDau { get; set; }
    [Required(ErrorMessage = "Ngày kết thúc không được để trống")]
    public DateTime? NgayKetThuc { get; set; }
   
}
