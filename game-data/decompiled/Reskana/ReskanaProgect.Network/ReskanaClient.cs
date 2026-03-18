using System;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Runtime.CompilerServices;
using System.Threading;
using ReskanaProgect.Internal;
using Reskana_7_0.Network;

namespace ReskanaProgect.Network;

public class ReskanaClient : IDisposable
{
	[CompilerGenerated]
	private Action<BufferSegmentStruct> _007B10780_007D;

	[CompilerGenerated]
	private Action<BrokenConnectionInfo> _007B10781_007D;

	public readonly bool IsAtServer;

	public BrokenConnectionInfo? BrokenByError;

	internal ReskanaConnection connection;

	internal ReskanaServer server;

	private SocketAsyncEventArgs _007B10782_007D;

	private SocketAsyncEventArgs _007B10783_007D;

	private MemoryBuffer _007B10784_007D = new MemoryBuffer
	{
		MaxSize = 1048576
	};

	private MemoryBuffer _007B10785_007D = new MemoryBuffer
	{
		MaxSize = 1048576
	};

	private int _007B10786_007D;

	private object _007B10787_007D = new object();

	private object _007B10788_007D = new object();

	private bool _007B10789_007D;

	private bool _007B10790_007D;

	private bool _007B10791_007D;

	private byte _007B10792_007D;

	private byte _007B10793_007D;

	private readonly IPAddress _007B10794_007D;

	public IPAddress? RemoteAddress
	{
		get
		{
			if (!IsAtServer)
			{
				return (connection.Api?.RemoteEndPoint as IPEndPoint)?.Address;
			}
			return _007B10794_007D;
		}
	}

	public bool IsStarted => _007B10789_007D;

	public event Action<BufferSegmentStruct> NextPacket
	{
		[CompilerGenerated]
		add
		{
			Action<BufferSegmentStruct> action = _007B10780_007D;
			Action<BufferSegmentStruct> action2;
			do
			{
				action2 = action;
				Action<BufferSegmentStruct> value2 = (Action<BufferSegmentStruct>)Delegate.Combine(action2, value);
				action = Interlocked.CompareExchange(ref _007B10780_007D, value2, action2);
			}
			while ((object)action != action2);
		}
		[CompilerGenerated]
		remove
		{
			Action<BufferSegmentStruct> action = _007B10780_007D;
			Action<BufferSegmentStruct> action2;
			do
			{
				action2 = action;
				Action<BufferSegmentStruct> value2 = (Action<BufferSegmentStruct>)Delegate.Remove(action2, value);
				action = Interlocked.CompareExchange(ref _007B10780_007D, value2, action2);
			}
			while ((object)action != action2);
		}
	}

	public event Action<BrokenConnectionInfo> ConnectionBroken
	{
		[CompilerGenerated]
		add
		{
			Action<BrokenConnectionInfo> action = _007B10781_007D;
			Action<BrokenConnectionInfo> action2;
			do
			{
				action2 = action;
				Action<BrokenConnectionInfo> value2 = (Action<BrokenConnectionInfo>)Delegate.Combine(action2, value);
				action = Interlocked.CompareExchange(ref _007B10781_007D, value2, action2);
			}
			while ((object)action != action2);
		}
		[CompilerGenerated]
		remove
		{
			Action<BrokenConnectionInfo> action = _007B10781_007D;
			Action<BrokenConnectionInfo> action2;
			do
			{
				action2 = action;
				Action<BrokenConnectionInfo> value2 = (Action<BrokenConnectionInfo>)Delegate.Remove(action2, value);
				action = Interlocked.CompareExchange(ref _007B10781_007D, value2, action2);
			}
			while ((object)action != action2);
		}
	}

	public ReskanaClient(ReskanaConnection _007B10758_007D, ReskanaServer _007B10759_007D)
	{
		IsAtServer = true;
		_007B10794_007D = _007B10758_007D.AcceptedIp;
		connection = _007B10758_007D;
		server = _007B10759_007D;
		_007B10789_007D = true;
		if (Config.DisableSaeaPool)
		{
			_007B10782_007D = new SocketAsyncEventArgs();
			_007B10783_007D = new SocketAsyncEventArgs();
			_007B10782_007D.SetBuffer(new byte[20480], 0, 20480);
			_007B10783_007D.SetBuffer(new byte[20480], 0, 20480);
		}
		else
		{
			_007B10782_007D = _007B10759_007D.ringSaeaPool.Get();
			_007B10783_007D = _007B10759_007D.ringSaeaPool.Get();
			_007B10782_007D.SetBuffer(0, 20480);
			_007B10783_007D.SetBuffer(0, 20480);
		}
		_007B10782_007D.Completed += _007B10775_007D;
		_007B10783_007D.Completed += _007B10766_007D;
	}

	public ReskanaClient()
	{
		IsAtServer = false;
	}

	public void Connect(IPEndPoint _007B10760_007D)
	{
		if (IsAtServer)
		{
			throw new InvalidOperationException();
		}
		_007B10782_007D = new SocketAsyncEventArgs();
		_007B10783_007D = new SocketAsyncEventArgs();
		_007B10782_007D.SetBuffer(new byte[20480], 0, 20480);
		_007B10783_007D.SetBuffer(new byte[20480], 0, 20480);
		_007B10782_007D.Completed += _007B10775_007D;
		_007B10783_007D.Completed += _007B10766_007D;
		lock (_007B10787_007D)
		{
			connection = new ReskanaConnection(new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp), null);
			_007B10792_007D = 0;
			_007B10793_007D = 0;
			_007B10786_007D = 0;
			_007B10784_007D.Clear();
			BrokenByError = null;
			connection.Api.Connect(_007B10760_007D);
			_007B10789_007D = true;
		}
	}

	public void Disconnect(bool _007B10761_007D = true, bool _007B10762_007D = true)
	{
		lock (_007B10787_007D)
		{
			if (!_007B10789_007D)
			{
				return;
			}
			_007B10789_007D = false;
		}
		lock (_007B10788_007D)
		{
			if (!IsAtServer || _007B10762_007D)
			{
				try
				{
					connection.Api.Shutdown(SocketShutdown.Both);
				}
				catch (Exception)
				{
				}
			}
			if (!_007B10762_007D)
			{
				connection.Api.Close();
			}
		}
		_007B10790_007D = false;
		if (_007B10762_007D)
		{
			lock (_007B10788_007D)
			{
				connection.Api.Close();
			}
		}
		if (!IsAtServer)
		{
			_007B10782_007D?.Dispose();
			_007B10783_007D?.Dispose();
		}
	}

	private void _007B10763_007D(in BrokenConnectionInfo _007B10764_007D)
	{
		lock (_007B10787_007D)
		{
			if (BrokenByError.HasValue)
			{
				return;
			}
			BrokenByError = _007B10764_007D;
		}
		_007B10781_007D?.Invoke(_007B10764_007D);
	}

	public void StartReceiving()
	{
		try
		{
			bool flag;
			lock (_007B10788_007D)
			{
				flag = !connection.Api.ReceiveAsync(_007B10783_007D);
			}
			if (flag)
			{
				_007B10766_007D(this, _007B10783_007D);
			}
		}
		catch (ObjectDisposedException)
		{
		}
		catch (InvalidOperationException ex2)
		{
			if (Config.InternalErrorsLogger != null)
			{
				Config.InternalErrorsLogger("Reskana: InvalidOperation during I/O: " + ex2.Message);
			}
		}
		catch (Exception ex3)
		{
			if (connection != null)
			{
				Config.InternalErrorsLogger("Reskana: Exception during I/O: " + ex3.Message);
			}
		}
	}

	private (float t1, float t2) StartSending(bool _007B10765_007D)
	{
		try
		{
			Stopwatch stopwatch = (_007B10765_007D ? Stopwatch.StartNew() : null);
			float item = 0f;
			bool flag;
			lock (_007B10788_007D)
			{
				stopwatch?.Stop();
				item = (float)(stopwatch?.Elapsed.TotalMilliseconds ?? 0.0);
				stopwatch?.Restart();
				flag = !connection.Api.SendAsync(_007B10782_007D);
			}
			stopwatch?.Stop();
			float item2 = (float)(stopwatch?.Elapsed.TotalMilliseconds ?? 0.0);
			stopwatch?.Restart();
			if (flag)
			{
				_007B10775_007D(this, _007B10782_007D);
			}
			return (t1: item, t2: item2);
		}
		catch (ObjectDisposedException)
		{
		}
		catch (InvalidOperationException ex2)
		{
			if (Config.InternalErrorsLogger != null)
			{
				Config.InternalErrorsLogger("Reskana: InvalidOperation during I/O: " + ex2.Message);
			}
		}
		catch (Exception ex3)
		{
			if (connection != null)
			{
				Config.InternalErrorsLogger("Reskana: Exception during I/O: " + ex3.Message);
			}
		}
		return default((float, float));
	}

	private unsafe void _007B10766_007D(object _007B10767_007D, SocketAsyncEventArgs _007B10768_007D)
	{
		try
		{
			if (_007B10783_007D.SocketError != SocketError.Success || _007B10783_007D.BytesTransferred == 0)
			{
				if (_007B10789_007D)
				{
					_007B10763_007D(new BrokenConnectionInfo(_007B10783_007D.SocketError, _007B10801_007D: true));
				}
				return;
			}
			int num = _007B10783_007D.Offset + _007B10783_007D.BytesTransferred;
			while (num > 5)
			{
				byte[] buffer = _007B10783_007D.Buffer;
				Protocol.InternalHeader internalHeader;
				fixed (byte* ptr = &buffer[0])
				{
					internalHeader = *(Protocol.InternalHeader*)ptr;
				}
				if (num < internalHeader.totalLength)
				{
					break;
				}
				bool flag = _007B10793_007D == internalHeader.control;
				bool flag2 = false;
				int num2 = internalHeader.totalLength - 5;
				if (flag)
				{
					_007B10785_007D.Reserve(internalHeader.totalLength);
					Protocol.PayloadDecode(buffer, 5, _007B10785_007D.Data, 0, num2, internalHeader.hash);
					ushort num3 = Protocol.FxtcpComputeChecksum(_007B10785_007D.Data, 0, num2);
					flag2 = num3 != internalHeader.hash;
					flag &= num3 == internalHeader.hash;
				}
				if (flag)
				{
					_007B10793_007D++;
					BufferSegmentStruct obj = new BufferSegmentStruct(_007B10785_007D.Data, 0, num2);
					try
					{
						_007B10780_007D?.Invoke(obj);
					}
					catch (Exception _007B10802_007D)
					{
						_007B10763_007D(new BrokenConnectionInfo(_007B10802_007D, _007B10803_007D: true));
						return;
					}
				}
				else
				{
					BrokenConnectionInfo _007B10764_007D = new BrokenConnectionInfo(_007B10804_007D: true)
					{
						ByMalformation = true,
						MoreInfo = (flag2 ? "order" : "hash")
					};
					_007B10763_007D(in _007B10764_007D);
					if (!flag2)
					{
						_007B10793_007D = internalHeader.control;
						_007B10793_007D++;
					}
				}
				if (!_007B10789_007D)
				{
					return;
				}
				num -= internalHeader.totalLength;
				if (num > 0)
				{
					Buffer.BlockCopy(buffer, internalHeader.totalLength, buffer, 0, num);
				}
			}
			try
			{
				if (_007B10783_007D.BytesTransferred > 0)
				{
					_007B10783_007D.SetBuffer(num, 20480 - num);
				}
			}
			catch (Exception _007B10802_007D2)
			{
				_007B10763_007D(new BrokenConnectionInfo(_007B10802_007D2, _007B10803_007D: true));
				return;
			}
			StartReceiving();
		}
		catch (ObjectDisposedException)
		{
		}
	}

	public (float socketTime, float completeTime) Send(in BufferSegmentStruct _007B10769_007D, bool _007B10770_007D = false)
	{
		if (_007B10769_007D.Length > 20475)
		{
			int num = 0;
			while (num < _007B10769_007D.Length)
			{
				BufferSegmentStruct _007B10769_007D2 = new BufferSegmentStruct(_007B10769_007D.Buffer, _007B10769_007D.StartPosition + num, Math.Min(_007B10769_007D.Length - num, 20475));
				num += _007B10769_007D2.Length;
				Send(in _007B10769_007D2);
			}
			return default((float, float));
		}
		byte _007B10774_007D = 0;
		lock (_007B10787_007D)
		{
			if (!_007B10789_007D || BrokenByError.HasValue)
			{
				return default((float, float));
			}
			_007B10774_007D = _007B10792_007D++;
			if (_007B10786_007D == 1)
			{
				_007B10784_007D.Reserve(_007B10784_007D.Size + _007B10769_007D.Length + 5);
				PutPacket(in _007B10769_007D, _007B10784_007D.Data, _007B10784_007D.Size, _007B10774_007D);
				_007B10784_007D.Size += _007B10769_007D.Length + 5;
				return default((float, float));
			}
			_007B10786_007D = 1;
		}
		_007B10782_007D.UserToken = _007B10769_007D.Length + 5;
		PutPacket(in _007B10769_007D, _007B10782_007D.Buffer, 0, _007B10774_007D);
		_007B10782_007D.SetBuffer(0, _007B10769_007D.Length + 5);
		return StartSending(_007B10770_007D);
	}

	private unsafe static void PutPacket(in BufferSegmentStruct _007B10771_007D, byte[] _007B10772_007D, int _007B10773_007D, byte _007B10774_007D)
	{
		Protocol.InternalHeader internalHeader = new Protocol.InternalHeader((ushort)(_007B10771_007D.Length + 5), Protocol.FxtcpComputeChecksum(_007B10771_007D.Buffer, _007B10771_007D.StartPosition, _007B10771_007D.Length), _007B10774_007D);
		fixed (byte* ptr = &_007B10772_007D[_007B10773_007D])
		{
			*(Protocol.InternalHeader*)ptr = internalHeader;
		}
		Protocol.PayloadEncode(_007B10771_007D.Buffer, _007B10771_007D.StartPosition, _007B10772_007D, _007B10773_007D + 5, _007B10771_007D.Length, internalHeader.hash);
	}

	private void _007B10775_007D(object _007B10776_007D, SocketAsyncEventArgs _007B10777_007D)
	{
		try
		{
			if (_007B10782_007D.SocketError != SocketError.Success || _007B10782_007D.BytesTransferred == 0)
			{
				if (_007B10789_007D)
				{
					ThreadPool.QueueUserWorkItem(delegate
					{
						_007B10763_007D(new BrokenConnectionInfo(_007B10804_007D: true));
					}, null);
				}
				return;
			}
			lock (_007B10787_007D)
			{
				int num = (int)_007B10782_007D.UserToken;
				num -= _007B10782_007D.BytesTransferred;
				if (num == 0)
				{
					if (_007B10784_007D == null)
					{
						return;
					}
					if (_007B10784_007D.Size == 0)
					{
						_007B10786_007D = 0;
						_007B10782_007D.UserToken = 0;
					}
					else
					{
						int num2 = Math.Min(20480, _007B10784_007D.Size);
						_007B10784_007D.TakeFromStart(20480, _007B10782_007D.Buffer, 0);
						num = num2;
						_007B10782_007D.SetBuffer(0, num);
					}
				}
				else
				{
					_007B10782_007D.SetBuffer(_007B10782_007D.Offset + _007B10782_007D.BytesTransferred, _007B10782_007D.Count - _007B10782_007D.BytesTransferred);
				}
				_007B10782_007D.UserToken = num;
			}
			if ((int)_007B10782_007D.UserToken > 0)
			{
				StartSending(_007B10765_007D: false);
			}
		}
		catch (ObjectDisposedException)
		{
		}
	}

	public void Dispose()
	{
		lock (_007B10787_007D)
		{
			if (_007B10791_007D)
			{
				return;
			}
			_007B10791_007D = true;
		}
		if (IsAtServer)
		{
			_007B10783_007D.Completed -= _007B10766_007D;
			_007B10782_007D.Completed -= _007B10775_007D;
			if (_007B10790_007D || Config.DisableSaeaPool)
			{
				_007B10783_007D.Dispose();
				_007B10782_007D.Dispose();
			}
			else
			{
				server.ringSaeaPool.Return(_007B10783_007D);
				server.ringSaeaPool.Return(_007B10782_007D);
			}
			_007B10783_007D = null;
			_007B10782_007D = null;
			connection = null;
			_007B10784_007D = null;
			_007B10785_007D = null;
		}
	}

	public string DebugInformation()
	{
		return $"IsConnected: {connection?.Api?.Connected}, SendBacklog size: {_007B10784_007D.Size}, SendPoll: {_007B10786_007D}, SendOffset: {_007B10782_007D?.Offset}, ReceiveOffset: {_007B10783_007D?.Offset}";
	}

	[CompilerGenerated]
	private void _007B10778_007D(object? _007B10779_007D)
	{
		_007B10763_007D(new BrokenConnectionInfo(_007B10804_007D: true));
	}
}
