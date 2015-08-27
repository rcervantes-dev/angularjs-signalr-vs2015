using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RTSPA.Template.SignalR
{
    public class NotificationItem
    {
        public string Name { get; set; }

        public decimal Value { get; set; }

        public DateTime Timestamp { get; set; }
    }
}