using System;
using System.Collections.Generic;

namespace DulkyVideo.Data
{
    public partial class AspNetUserRoles
    {
        public long UserId { get; set; }
        public string RoleId { get; set; }

        public virtual AspNetRoles Role { get; set; }
        public virtual AspNetUsers User { get; set; }
    }
}
