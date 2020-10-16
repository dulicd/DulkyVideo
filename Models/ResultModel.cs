using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DulkyVideo.Models
{
    public class ResultModel<T>
    {
        public T Value { get; set; }
        public bool Succeeded { get; set; }
    }
}
