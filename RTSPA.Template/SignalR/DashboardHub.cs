using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace RTSPA.Template.SignalR
{
    [HubName("dashboardhub")]
    public class DashboardHub : Hub
    {
        private readonly NotificationTicker _notificationTicker;

        public DashboardHub() :
            this(NotificationTicker.Instance)
        {

        }

        public DashboardHub(NotificationTicker notificationTicker)
        {
            _notificationTicker = notificationTicker;
        }

        #region notifications methods

        public IEnumerable<NotificationItem> GetCurrentNotifications()
        {
            return _notificationTicker.GetCurrentNotifications();
        }

        public void EnableNotifications()
        {
            _notificationTicker.EnableNotifications();
        }

        public void DisableNotifications()
        {
            _notificationTicker.DisableNotifications();
        }

        #endregion
       
    }
}