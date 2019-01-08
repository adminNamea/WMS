using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

public class PageList<T> : List<T>
{
    #region 分页
    //页索引
    public int PageIndex { get; private set; }
    //页大小
    public int PageSize { get; private set; }
    //总数据条数
    public int TotalCount { get; private set; }
    //总页数
    public int TotalPages { get; private set; }

    public PageList(List<T> source, int pageIndex, int pageSize)
    {
        this.PageIndex = pageIndex;
        this.PageSize = pageSize;
        this.TotalCount = source.Count;
        this.TotalPages = (int)Math.Ceiling(TotalCount / (double)PageSize);
        this.AddRange(source.Skip((PageIndex - 1) * PageSize).Take(PageSize));
    }

    public bool HasPreviouPage
    {
        get { return PageIndex > 1; }
    }
    public bool HasNextPage
    {
        get { return PageIndex < TotalPages; }
    }
    #endregion
}





