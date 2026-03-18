using System;
using System.Collections.Generic;
using System.Net;

namespace ReskanaProgect;

public sealed class DdosProtection2PerSec
{
	private class IPTable
	{
		public DateTime connectionHistory0;

		public DateTime connectionHistory1;

		public IPTable()
		{
			connectionHistory0 = DateTime.Now;
		}

		public void Push()
		{
			connectionHistory1 = connectionHistory0;
			connectionHistory0 = DateTime.Now;
		}

		public bool Block()
		{
			DateTime now = DateTime.Now;
			if (now.Ticks - connectionHistory0.Ticks > 10000000)
			{
				return now.Ticks - connectionHistory1.Ticks > 10000000;
			}
			return false;
		}
	}

	public static long BlokcedConnections;

	private Dictionary<IPAddress, IPTable> _007B10730_007D;

	public DdosProtection2PerSec(int _007B10728_007D)
	{
		_007B10730_007D = new Dictionary<IPAddress, IPTable>(1023 + 24 * _007B10728_007D);
	}

	public bool AllowConnection(IPAddress _007B10729_007D)
	{
		if (!_007B10730_007D.TryGetValue(_007B10729_007D, out IPTable value))
		{
			value = new IPTable();
			_007B10730_007D.Add(_007B10729_007D, value);
			return true;
		}
		bool num = value.Block();
		if (!num)
		{
			BlokcedConnections++;
		}
		value.Push();
		return num;
	}
}
