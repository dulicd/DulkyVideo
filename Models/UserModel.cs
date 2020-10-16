using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DulkyVideo.Models
{
    public class UserModel
    {
        public string ContactId { get; set; }
        public List<SelectListItem> Contacts { get; set; }
    }
}
