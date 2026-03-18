using System;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Threading;
using ManualPacketSerialization;

namespace ReskanaProgect.Network;

public class ReskanaClient2 : IDisposable
{
	private Socket _007B10821_007D;

	private readonly object _007B10822_007D = new object();

	private bool _007B10823_007D;

	private SocketAsyncEventArgs _007B10824_007D;

	private SocketAsyncEventArgs _007B10825_007D;

	private int _007B10826_007D;

	private MemoryBuffer _007B10827_007D;

	private MemoryBuffer _007B10828_007D;

	private object _007B10829_007D = new object();

	private int _007B10830_007D;

	private int _007B10831_007D;

	[CompilerGenerated]
	private Action<IMPSerializable> _007B10832_007D;

	public event Action<IMPSerializable> OnPacket
	{
		[CompilerGenerated]
		add
		{
			Action<IMPSerializable> action = _007B10832_007D;
			Action<IMPSerializable> action2;
			do
			{
				action2 = action;
				Action<IMPSerializable> value2 = (Action<IMPSerializable>)Delegate.Combine(action2, value);
				action = Interlocked.CompareExchange(ref _007B10832_007D, value2, action2);
			}
			while ((object)action != action2);
		}
		[CompilerGenerated]
		remove
		{
			Action<IMPSerializable> action = _007B10832_007D;
			Action<IMPSerializable> action2;
			do
			{
				action2 = action;
				Action<IMPSerializable> value2 = (Action<IMPSerializable>)Delegate.Remove(action2, value);
				action = Interlocked.CompareExchange(ref _007B10832_007D, value2, action2);
			}
			while ((object)action != action2);
		}
	}

	public ReskanaClient2(int _007B10809_007D, int _007B10810_007D)
	{
		_007B10824_007D = new SocketAsyncEventArgs();
		_007B10825_007D = new SocketAsyncEventArgs();
		_007B10826_007D = _007B10810_007D;
		_007B10824_007D.SetBuffer(new byte[_007B10809_007D]);
		_007B10825_007D.SetBuffer(new byte[_007B10809_007D]);
		_007B10824_007D.Completed += _007B10814_007D;
		_007B10825_007D.Completed += _007B10817_007D;
		_007B10827_007D = new MemoryBuffer
		{
			MaxSize = _007B10810_007D
		};
		_007B10828_007D = new MemoryBuffer
		{
			MaxSize = _007B10810_007D
		};
	}

	public void Start()
	{
		_007B10811_007D(_007B10812_007D: false, _007B10824_007D);
	}

	public void Stop()
	{
		lock (_007B10822_007D)
		{
			if (!_007B10823_007D)
			{
				return;
			}
			_007B10823_007D = false;
			_007B10821_007D.Close();
		}
		_007B10824_007D.Dispose();
		_007B10825_007D.Dispose();
	}

	public void Dispose()
	{
		Stop();
	}

	private void _007B10811_007D(bool _007B10812_007D, SocketAsyncEventArgs _007B10813_007D)
	{
		bool flag = false;
		try
		{
			lock (_007B10822_007D)
			{
				if (!_007B10823_007D)
				{
					return;
				}
				flag = ((!_007B10812_007D) ? (!_007B10821_007D.ReceiveAsync(_007B10813_007D)) : (!_007B10821_007D.SendAsync(_007B10813_007D)));
			}
		}
		catch (ObjectDisposedException)
		{
		}
		catch (Exception)
		{
		}
		if (flag)
		{
			if (_007B10812_007D)
			{
				_007B10817_007D(this, _007B10813_007D);
			}
			else
			{
				_007B10814_007D(this, _007B10813_007D);
			}
		}
	}

	private void _007B10814_007D(object _007B10815_007D, SocketAsyncEventArgs _007B10816_007D)
	{
		lock (_007B10822_007D)
		{
			if (!_007B10823_007D)
			{
				return;
			}
		}
		if (_007B10824_007D.BytesTransferred != 0)
		{
			_ = _007B10824_007D.SocketError;
		}
		_007B10811_007D(_007B10812_007D: false, _007B10824_007D);
	}

	private void _007B10817_007D(object _007B10818_007D, SocketAsyncEventArgs _007B10819_007D)
	{
		lock (_007B10822_007D)
		{
			if (!_007B10823_007D)
			{
				return;
			}
		}
		if (_007B10825_007D.BytesTransferred != 0)
		{
			_ = _007B10825_007D.SocketError;
		}
		lock (_007B10829_007D)
		{
		}
		_007B10811_007D(_007B10812_007D: true, _007B10825_007D);
	}

	public void Send(in BufferSegmentStruct _007B10820_007D)
	{
		lock (_007B10829_007D)
		{
			if (_007B10830_007D > 0)
			{
				return;
			}
		}
		_007B10811_007D(_007B10812_007D: true, _007B10825_007D);
	}
}
