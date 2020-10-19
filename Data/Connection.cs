using System;
using System.Collections.Generic;

namespace DulkyVideo.Data
{
    public partial class Connection
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string ConnectionId { get; set; }
        public string UserAgent { get; set; }
        public bool? Connected { get; set; }

        public virtual AspNetUsers User { get; set; }
    }
}
