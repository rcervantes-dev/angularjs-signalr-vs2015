using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR;

namespace RTSPA.Template.SignalR
{
    public class NotificationTicker
    {
        // Singleton instance
        private readonly static Lazy<NotificationTicker> _instance = new Lazy<NotificationTicker>(
            () => new NotificationTicker(GlobalHost.ConnectionManager.GetHubContext<DashboardHub>().Clients));

        private readonly object _notificationStateLock = new object();
        private readonly object _updateNotificationLock = new object();

        private readonly ConcurrentDictionary<string, NotificationItem> _items = new ConcurrentDictionary<string, NotificationItem>();

        private readonly TimeSpan _updateInterval = TimeSpan.FromMilliseconds(3000);

        private Timer _timer;
        private volatile bool _updatingNotifications;
        private volatile NotificationState _notificationState;

        private NotificationTicker(IHubConnectionContext<dynamic> clients)
        {
            Clients = clients;
            LoadInitialData();
        }

        public static NotificationTicker Instance
        {
            get
            {
                return _instance.Value;
            }
        }

        private IHubConnectionContext<dynamic> Clients
        {
            get;
            set;
        }

        public NotificationState NotificationState
        {
            get { return _notificationState; }
            set { _notificationState = value; }
        }

        public IEnumerable<NotificationItem> GetCurrentNotifications()
        {
            return _items.Values;
        }

        #region public methods

        public void EnableNotifications()
        {
            lock (_notificationStateLock)
            {
                if (NotificationState != NotificationState.Enabled)
                {
                    _timer = new Timer(UpdateNotifications, null, _updateInterval, _updateInterval);

                    NotificationState = NotificationState.Enabled;

                    BroadcastNotificationStateChange(NotificationState.Enabled);
                }
            }
        }

        public void DisableNotifications()
        {
            lock (_notificationStateLock)
            {
                if (NotificationState == NotificationState.Enabled)
                {
                    if (_timer != null)
                    {
                        _timer.Dispose();
                    }

                    NotificationState = NotificationState.Disabled;

                    BroadcastNotificationStateChange(NotificationState.Disabled);
                }
            }
        }

        public void Reset()
        {
            lock (_notificationStateLock)
            {
                if (NotificationState != NotificationState.Disabled)
                {
                    throw new InvalidOperationException("Notification must be disabled before it can be reset.");
                }

                LoadInitialData();
                BroadcastNotificationReset();
            }
        }

        #endregion

        #region private methods

        private void LoadInitialData()
        {
            _items.Clear();

            var items = new List<NotificationItem>
            {
                new NotificationItem { Name = "Item 1", Value = 23, Timestamp = DateTime.Now },
                new NotificationItem { Name = "Item 2", Value = 17, Timestamp = DateTime.Now },
                new NotificationItem { Name = "Item 3", Value = 37, Timestamp = DateTime.Now }
            };

            items.ForEach(item => _items.TryAdd(item.Name, item));
        }

        private void UpdateNotifications(object state)
        {
            // This function must be re-entrant as it's running as a timer interval handler
            lock (_updateNotificationLock)
            {
                if (!_updatingNotifications)
                {
                    _updatingNotifications = true;

                    foreach (var item in _items.Values)
                    {
                        if (TryUpdateNotification(item))
                        {
                            Thread.Sleep(1000);
                            BroadcastNotificationItem(item);
                        }
                    }

                    _updatingNotifications = false;
                }
            }
        }

        private bool TryUpdateNotification(NotificationItem item)
        {
            Random rnd = new Random();
            item.Value = rnd.Next(52);
            item.Timestamp = DateTime.Now;
            return true;
        }

        private void BroadcastNotificationStateChange(NotificationState notificationState)
        {
            switch (notificationState)
            {
                case NotificationState.Enabled:
                    Clients.All.notificationEnabled();
                    break;
                case NotificationState.Disabled:
                    Clients.All.notificationDisabled();
                    break;
                default:
                    break;
            }
        }

        private void BroadcastNotificationReset()
        {
            Clients.All.notificationReset();
        }

        private void BroadcastNotificationItem(NotificationItem item)
        {
            Clients.All.updateNotification(item);
        }

        #endregion

    }

    public enum NotificationState
    {
        Disabled,
        Enabled
    }
}