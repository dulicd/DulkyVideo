﻿using System;
using System.Collections.Generic;

namespace DulkyVideo.Data
{
    public partial class AspNetUserClaims
    {
        public int Id { get; set; }
        public long UserId { get; set; }
        public string ClaimType { get; set; }
        public string ClaimValue { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
