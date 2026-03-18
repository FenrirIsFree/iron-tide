using System;
using System.Net;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Threading;
using ReskanaProgect.Internal;
using TheraEngine.Collections;

namespace ReskanaProgect.Network;

public class ReskanaServer : IDisposable
{
	[CompilerGenerated]
	private Action<ReskanaClient> _007B10848_007D;

	public Func<IPAddress, bool> IpChecker;

	public volatile bool AllowNewConnections = true;

	public readonly int ApproxOnlineParam;

	private Socket _007B10849_007D;

	internal ObjectPool<SocketAsyncEventArgs> ringSaeaPool;

	private bool _007B10850_007D;

	private object _007B10851_007D = new object();

	private EndPoint _007B10852_007D;

	public bool IsListening => _007B10850_007D;

	public event Action<ReskanaClient> NewClientConnected
	{
		[CompilerGenerated]
		add
		{
			Action<ReskanaClient> action = _007B10848_007D;
			Action<ReskanaClient> action2;
			do
			{
				action2 = action;
				Action<ReskanaClient> value2 = (Action<ReskanaClient>)Delegate.Combine(action2, value);
				action = Interlocked.CompareExchange(ref _007B10848_007D, value2, action2);
			}
			while ((object)action != action2);
		}
		[CompilerGenerated]
		remove
		{
			Action<ReskanaClient> action = _007B10848_007D;
			Action<ReskanaClient> action2;
			do
			{
				action2 = action;
				Action<ReskanaClient> value2 = (Action<ReskanaClient>)Delegate.Remove(action2, value);
				action = Interlocked.CompareExchange(ref _007B10848_007D, value2, action2);
			}
			while ((object)action != action2);
		}
	}

	public ReskanaServer(int _007B10837_007D, EndPoint _007B10838_007D)
	{
		ApproxOnlineParam = _007B10837_007D;
		_007B10852_007D = _007B10838_007D;
		ringSaeaPool = new ObjectPool<SocketAsyncEventArgs>(delegate
		{
			SocketAsyncEventArgs e = new SocketAsyncEventArgs();
			e.SetBuffer(new byte[20480], 0, 20480);
			return e;
		}, _007B10837_007D);
	}

	public void Start()
	{
		lock (_007B10851_007D)
		{
			if (_007B10850_007D)
			{
				return;
			}
			_007B10850_007D = true;
		}
		SocketAsyncEventArgs e = new SocketAsyncEventArgs();
		e.Completed += _007B10841_007D;
		_007B10849_007D = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
		_007B10849_007D.Bind(_007B10852_007D);
		_007B10849_007D.Listen(Config.BacklogSize);
		ThreadPool.QueueUserWorkItem(delegate(object? _007B10847_007D)
		{
			_007B10839_007D((SocketAsyncEventArgs)_007B10847_007D);
		}, e);
	}

	private void _007B10839_007D(SocketAsyncEventArgs _007B10840_007D)
	{
		lock (_007B10851_007D)
		{
			if (_007B10850_007D && !_007B10849_007D.AcceptAsync(_007B10840_007D))
			{
				_007B10841_007D(this, _007B10840_007D);
			}
		}
	}

	private void _007B10841_007D(object _007B10842_007D, SocketAsyncEventArgs _007B10843_007D)
	{
		if (_007B10843_007D.SocketError != SocketError.SocketError && _007B10843_007D.SocketError != SocketError.OperationAborted && _007B10843_007D.AcceptSocket != null)
		{
			try
			{
				_007B10844_007D(_007B10843_007D.AcceptSocket);
			}
			catch (Exception)
			{
				_007B10843_007D.AcceptSocket.Close(0);
				if (Config.InternalErrorsLogger != null && _007B10850_007D)
				{
					Config.InternalErrorsLogger("Reskana: Error while FetchConnection");
				}
			}
			_007B10843_007D.AcceptSocket = null;
		}
		_007B10839_007D(_007B10843_007D);
	}

	public void Stop()
	{
		lock (_007B10851_007D)
		{
			_007B10849_007D.Close(0);
			_007B10850_007D = false;
		}
	}

	private void _007B10844_007D(Socket _007B10845_007D)
	{
		IPAddress ip = (_007B10845_007D.RemoteEndPoint as IPEndPoint)?.Address;
		if (ip != null && (IpChecker == null || IpChecker(ip)) && AllowNewConnections)
		{
			ThreadPool.QueueUserWorkItem(delegate
			{
				try
				{
					ReskanaClient obj = new ReskanaClient(new ReskanaConnection(_007B10845_007D, ip), this);
					_007B10848_007D?.Invoke(obj);
				}
				catch (Exception ex)
				{
					Config.InternalErrorsLogger("Reskana: error while creating client " + ex.Message + ", " + ex.Source);
				}
			});
		}
		else
		{
			_007B10845_007D.Close(0);
			if (ip == null)
			{
				Config.InternalErrorsLogger("Reskana: IP is null when FetchConnection");
			}
		}
	}

	public void Dispose()
	{
		lock (_007B10851_007D)
		{
			if (_007B10850_007D)
			{
				throw new InvalidOperationException("You must call stop");
			}
		}
	}

	[CompilerGenerated]
	private void _007B10846_007D(object? _007B10847_007D)
	{
		_007B10839_007D((SocketAsyncEventArgs)_007B10847_007D);
	}
}
